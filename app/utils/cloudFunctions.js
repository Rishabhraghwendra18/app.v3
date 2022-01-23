Moralis.Cloud.define("toIpfs", async (request) => {
  const result = await Moralis.Cloud.toIpfs({
    sourceType: request.params.sourceType,
    source: request.params.source,
  });
  return result;
});

Moralis.Cloud.beforeSave("UserInfo", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const existingUserInfoQuery = new Moralis.Query("UserInfo");
  existingUserInfoQuery.equalTo("objectId", request.object.id);

  const existingUser = await existingUserInfoQuery.first();

  if (existingUser) {
    if (request.object.get("ethAddress") !== existingUser.get("ethAddress")) {
      logger.error("Cannot change ethAddress");
      throw "Cannot change ethAddress";
    }

    if (
      request.object.get("spectUsername") !== existingUser.get("spectUsername") &&
      existingUser.get("isInitialized")
    ) {
      logger.error("Cannot change spect username once set");
      throw "Cannot change spect username once set";
    } else if (
      request.object.get("spectUsername") !== existingUser.get("spectUsername") &&
      !existingUser.get("isInitialized")
    ) {
      const existingUsernamesQuery = new Moralis.Query("UserInfo");
      existingUsernamesQuery.equalTo("spectUsername", request.object.get("spectUsername"));
      const usernameExists = await existingUsernamesQuery.first({
        useMasterKey: true,
      });
      if (usernameExists) {
        throw "Invalid username";
      }
      request.object.set("isInitialized", true);
    }
  }
  if (!request.master) {
    if (
      request.object.get("createdBounties") ||
      request.object.get("freelancedBounties") ||
      request.object.get("completedBounties") ||
      request.object.get("successRate")
    ) {
      throw "Cannot set user stats from client";
    }
  }
  if (request.object.get("organizationId")) {
    request.object.set("organizationVerified", false);
  }
});

Moralis.Cloud.beforeSave("Proposal", async (request) => {
  if (!request.master) {
    if (request.object.get("failedJobs") || request.object.get("completedJobs")) {
      throw "Cannot set user stats from client";
    }
  }
  const existingProposalQuery = new Moralis.Query("Proposal");
  existingProposalQuery.equalTo("freelancer", request.object.freelancer);
  existingProposalQuery.equalTo("dealId", request.object.dealId);

  const existingProposal = await existingProposalQuery.first({
    useMasterKey: true,
  });

  if (existingProposal) {
    throw "Already created a proposal for this gig";
  }
});

async function fetchIPFSDoc(ipfsHash) {
  const res = await Moralis.Cloud.httpRequest({
    url: `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`,
  });
  return res.data;
}

async function getUsernameFromAddress(ethAddress) {
  const userInfo = new Moralis.Query("UserInfo");
  userInfo.equalTo("ethAddress", ethAddress);
  const user = await userInfo.first();
  return user.get("spectUsername");
}

async function getAddressFromUsername(spectUsername) {
  const userInfo = new Moralis.Query("UserInfo");
  userInfo.equalTo("spectUsername", spectUsername);
  const user = await userInfo.first();
  return user.get("ethAddress");
}

async function validateStatusChange(oldStatus, newStatus) {
  if (oldStatus === 101) return newStatus === 102 || newStatus === 401 || newStatus === 404;
  else if (oldStatus === 102) return newStatus === 201 || newStatus === 101;
  else if (oldStatus === 201) return newStatus === 402 || newStatus === 202;
  else if (oldStatus === 202) return newStatus === 203 || newStatus === 403 || newStatus === 204;
  else if (oldStatus === 204) return newStatus === 203 || newStatus === 403 || newStatus === 202;
  else if (oldStatus === 401) return false;
  else if (oldStatus === 403) return newStatus === 203;
}

Moralis.Cloud.afterSave("Bounty", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info(`request object ${JSON.stringify(request.object)}`);

  const status = request.object.get("status");
  if (status === 0) {
    await sendEmail("createBounty", request.object);
  } else if (status === 2) {
    await sendEmail("workSubmitted", request.object);
  } else if (status === 3) {
    await sendEmail("workAccepted", request.object);
  } else if (status === -1) {
    await sendEmail("deadlineViolationCalled", request.object);
  } else if (status === 4) {
    await sendEmail("dispute", request.object);
  }
});

Moralis.Cloud.afterSave("Proposal", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info(`request object ${JSON.stringify(request.object)}`);

  const status = request.object.get("status");
  if (status === 2) {
    await sendEmail("acceptProposal", request.object);
  }
});

Moralis.Cloud.beforeConsume("ListedGig", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("ListedGig", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  const bountyQuery = new Moralis.Query("Bounty");
  bountyQuery.equalTo("dealId", request.object.get("dealId"));
  const existingBounty = await bountyQuery.first();

  if (!existingBounty) {
    const bounty = new Moralis.Object("Bounty");
    bounty.set("tags", request.object.get("tags"));
    bounty.set("gigHash", request.object.get("gigCid"));

    const clientUsername = await getUsernameFromAddress(request.object.get("client"));
    bounty.set("clientUsername", clientUsername);
    bounty.set("reward", parseFloat(request.object.get("reward")) / Math.pow(10, 18));
    bounty.set("timeToAcceptInDays", parseInt(request.object.get("timeToAcceptInMinutes")) / (24 * 60));
    bounty.set("dealId", request.object.get("dealId"));
    bounty.set("status", 101);

    const gig = await fetchIPFSDoc(request.object.get("gigCid"));

    bounty.set("name", gig.name);
    bounty.set("description", gig.description);
    bounty.set("minStake", parseFloat(gig.desiredCollateral));
    bounty.set("deadline", new Date(gig.desiredSubmissionDeadline));
    bounty.set("tags", gig.tags);
    bounty.set("teamAddress", gig.team);
    bounty.set("revisions", parseInt(gig.desiredRevisions));
    bounty.set("timeToRevise", parseInt(gig.desiredTimeToRevise));

    try {
      await bounty.save(null, { useMasterKey: true });
    } catch (err) {
      logger.error(`Error while listing gig ${err}`);
    }
  }
});

Moralis.Cloud.beforeConsume("DelistedGig", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("DelistedGig", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 401);
    if (canUpdate) {
      bounty.set("status", 401);

      await Moralis.Object.saveAll([bounty], { useMasterKey: true });
    }
  } catch (err) {
    logger.error(`Error while delising gig ${err}`);
  }
});

Moralis.Cloud.beforeConsume("ClientConfirmation", async (event) => {
  return event && event.confirmed;
});

Moralis.Cloud.afterSave("ClientConfirmation", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    // Change proposal status to accepted
    var proposalQuery = new Moralis.Query("Proposal");
    proposalQuery.equalTo("dealId", request.object.get("dealId"));
    proposalQuery.equalTo("freelancerAddress", request.object.get("freelancer"));
    var proposal = await proposalQuery.first();
    proposal.set("status", 103);

    // Change bounty status to pending second confirmation
    var bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", proposal.get("dealId"));
    var bounty = await bountyQuery.first();

    const canUpdate = await validateStatusChange(bounty.get("status"), 102);
    if (canUpdate) {
      bounty.set("status", 102);
      bounty.set("deadline", new Date(request.object.get("deadline") * 1000));

      // Create notification object
      const notification = await getNotificationObject(
        proposal.get("dealId"),
        proposal.get("freelancer"),
        bounty.get("clientUsername"),
        "accepted your proposal",
        proposal.get("title"),
        1,
        proposal.id
      );

      // Save atomically and send email
      await Moralis.Object.saveAll([proposal, notification, bounty], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while client confirmation ${err}`);
  }
});

Moralis.Cloud.beforeConsume("ConfirmationDeadlineViolation", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("ConfirmationDeadlineViolation", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 101);
    if (canUpdate) {
      // Change proposal status to rejected
      var proposalQuery = new Moralis.Query("Proposal");
      proposalQuery.equalTo("dealId", request.object.get("dealId"));
      proposalQuery.equalTo("status", 103);

      var proposal = await proposalQuery.first();
      proposal.set("status", 401);

      bounty.set("status", 101);

      const notification = await getNotificationObject(
        proposal.get("dealId"),
        proposal.get("freelancer"),
        bounty.get("clientUsername"),
        "called confirmation deadline violation on",
        proposal.get("title"),
        3,
        proposal.id
      );
      await Moralis.Object.saveAll([bounty, proposal], { useMasterKey: true });
    }
  } catch (err) {
    logger.error(`Error while freelancer confirmation ${err}`);
  }
});

Moralis.Cloud.beforeConsume("FreelancerConfirmation", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("FreelancerConfirmation", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 201);
    if (canUpdate) {
      const freelancerUsername = await getUsernameFromAddress(request.object.get("freelancer"));

      bounty.set("status", 201);
      bounty.set("freelancer", freelancerUsername);

      const notification = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("clientUsername"),
        freelancerUsername,
        "started work on",
        bounty.get("name"),
        2,
        null
      );
      await Moralis.Object.saveAll([bounty, notification], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while freelancer confirmation ${err}`);
  }
});

Moralis.Cloud.beforeConsume("SubmittedWork", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("SubmittedWork", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 202);
    const submissions = await bounty.get("submissions");
    if (canUpdate) {
      bounty.set("status", 202);
      if (submissions) {
        submissions.push(request.object.get("submission"));
        bounty.set("submissions", submissions);
      } else {
        bounty.set("submissions", [request.object.get("submission")]);
      }
      const notification = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("clientUsername"),
        bounty.get("freelancer"),
        "made a submission on",
        bounty.get("name"),
        3,
        null
      );
      await Moralis.Object.saveAll([bounty, notification], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while submitting work ${err}`);
  }
});

async function fulfill(dealId, feedback) {
  const bountyQuery = new Moralis.Query("Bounty");
  bountyQuery.equalTo("dealId", dealId);
  const bounty = await bountyQuery.first();
  const canUpdate = await validateStatusChange(bounty.get("status"), 203);
  if (canUpdate) {
    bounty.set("status", 203);
    if (feedback) {
      const feedbackObject = await fetchIPFSDoc(feedback);
      bounty.set("rating", feedbackObject.rating);
      bounty.set("review", feedbackObject.review);
    }
    const notification = await getNotificationObject(
      dealId,
      bounty.get("freelancer"),
      bounty.get("clientUsername"),
      "accepted your work on",
      bounty.get("name"),
      4,
      null
    );
    await Moralis.Object.saveAll([bounty, notification], {
      useMasterKey: true,
    });
  }
}

Moralis.Cloud.beforeConsume("FulfilledGig", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("FulfilledGig", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    await fulfill(request.object.get("dealId"), request.object.get("feedback"));
  } catch (err) {
    logger.error(`Error while fulfilling work ${err}`);
  }
});

Moralis.Cloud.beforeConsume("SubmissionDeadlineViolation", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("SubmissionDeadlineViolation", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 402);
    if (canUpdate) {
      bounty.set("status", 402);
      const notification = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("freelancer"),
        bounty.get("clientUsername"),
        "called a deadline violation on",
        bounty.get("name"),
        5,
        null
      );
      await Moralis.Object.saveAll([bounty, notification], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while calling submission deadline violation ${err}`);
  }
});

Moralis.Cloud.beforeConsume("AcceptanceDeadlineViolation", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("AcceptanceDeadlineViolation", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    await fulfill(request.object.get("dealId"), null);
    await Moralis.Object.saveAll([bounty, notification], {
      useMasterKey: true,
    });
  } catch (err) {
    logger.error(`Error while calling acceptance deadline violation ${err}`);
  }
});

Moralis.Cloud.beforeConsume("Dispute", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("Dispute", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 403);
    if (canUpdate) {
      bounty.set("status", 403);
      bounty.set("evidence", request.object.get("evidence"));
      const notification = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("freelancer"),
        bounty.get("clientUsername"),
        "called a dispute on",
        bounty.get("name"),
        6,
        null
      );
      await Moralis.Object.saveAll([bounty, notification], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while calling dispute ${err}`);
  }
});

Moralis.Cloud.beforeConsume("Ruling", async (event) => {
  return event && event.confirmed;
});

Moralis.Cloud.beforeConsume("ResolvedDispute", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("ResolvedDispute", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 3);
    if (canUpdate) {
      bounty.set("status", 3);
      const notificationForFreelancer = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("freelancer"),
        "Arbitrators",
        "resolved dispute on",
        bounty.get("name"),
        6,
        null
      );
      const notificationForClient = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("clientUsername"),
        "Arbitrators",
        "resolved dispute on",
        bounty.get("name"),
        6,
        null
      );
      await Moralis.Object.saveAll([bounty, notificationForFreelancer, notificationForClient], { useMasterKey: true });
    }
  } catch (err) {
    logger.error(`Error while resolving dispute ${err}`);
  }
});

Moralis.Cloud.beforeConsume("RevisionRequests", async (event) => {
  return event && event.confirmed;
});
Moralis.Cloud.afterSave("RevisionRequests", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  try {
    const bountyQuery = new Moralis.Query("Bounty");
    bountyQuery.equalTo("dealId", request.object.get("dealId"));
    const bounty = await bountyQuery.first();
    const canUpdate = await validateStatusChange(bounty.get("status"), 204);
    const instructions = await bounty.get("revisionInstructions");
    if (canUpdate) {
      bounty.set("status", 204);
      if (instructions) {
        instructions.push(request.object.get("instruction"));
        bounty.set("revisionInstructions", instructions);
      } else {
        bounty.set("revisionInstructions", [request.object.get("instruction")]);
      }
      const notification = await getNotificationObject(
        request.object.get("dealId"),
        bounty.get("freelancer"),
        bounty.get("clientUsername"),
        "requested revision on",
        bounty.get("name"),
        5,
        null
      );
      await Moralis.Object.saveAll([bounty, notification], {
        useMasterKey: true,
      });
    }
  } catch (err) {
    logger.error(`Error while calling revision ${err}`);
  }
});

Moralis.Cloud.define("filterBounties", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  const query = new Moralis.Query("Bounty");

  const sortOrder = request.params.sortOrder === "desc" ? -1 : 1;

  const pipelineWithoutTags = [
    {
      match: {
        $expr: {
          $and: [
            { $eq: ["$status", 101] },
            { $gte: ["$minStake", request.params.lockedStake[0]] },
            { $lte: ["$minStake", request.params.lockedStake[1]] },
          ],
        },
      },
    },

    {
      lookup: {
        from: "UserInfo",
        localField: "clientUsername",
        foreignField: "spectUsername",
        as: "user",
      },
    },
    {
      sort: {
        [request.params.sortBy]: sortOrder,
      },
    },
  ];

  try {
    let res;
    res = await query.aggregate(pipelineWithoutTags, {
      useMasterKey: true,
    });

    if (request.params.tags.length > 0) {
      res = res.filter((r) => r.tags.some((t) => request.params.tags.includes(t)));
    }
    var bounties = [];
    for (var bounty of res) {
      if (bounty?.user[0]?.organizationVerified) {
        const orgQuery = new Moralis.Query("Organization");
        orgQuery.equalTo("objectId", bounty?.user[0]?.organizationId);
        const org = await orgQuery.first();
        bounty.user[0]["organizationPicture"] = org.get("picture");
        bounty.user[0]["organizationName"] = org.get("name");
      }
      bounties.push(bounty);
    }
    return bounties;
  } catch (err) {
    logger.error(`Error whilte filtering bounties ${JSON.stringify(err)}`);
    return false;
  }
});

Moralis.Cloud.define("filterMyBounties", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  const query = new Moralis.Query("Bounty");
  const sortOrder = request.params.sortOrder === "desc" ? -1 : 1;

  const pipelineWithStatus = [
    {
      match: {
        $expr: {
          $and: [
            { $gte: ["$status", request.params.status] },
            { $lt: ["$status", request.params.status + 1] },
            {
              $or: [
                { $eq: ["$clientUsername", request.user.get("spectUsername")] },
                {
                  $eq: ["$freelancer", request.user.get("spectUsername")],
                },
              ],
            },
          ],
        },
      },
    },

    {
      lookup: {
        from: "UserInfo",
        localField: "clientUsername",
        foreignField: "spectUsername",
        as: "user",
      },
    },
    {
      sort: {
        [request.params.sortBy]: sortOrder,
      },
    },
  ];

  const pipelineWithoutStatus = [
    {
      match: {
        $expr: {
          $and: [
            {
              $or: [
                { $eq: ["$clientUsername", request.user.get("spectUsername")] },
                {
                  $eq: ["$freelancer", request.user.get("spectUsername")],
                },
              ],
            },
          ],
        },
      },
    },

    {
      lookup: {
        from: "UserInfo",
        localField: "clientUsername",
        foreignField: "spectUsername",
        as: "user",
      },
    },
    {
      sort: {
        [request.params.sortBy]: sortOrder,
      },
    },
  ];

  try {
    let res;
    if (request.params.status || request.params.status === 0) {
      res = await query.aggregate(pipelineWithStatus, { useMasterKey: true });
    } else {
      return await query.aggregate(pipelineWithoutStatus, {
        useMasterKey: true,
      });
    }
    return res;
  } catch (err) {
    logger.error(`Error whilte filtering bounties ${JSON.stringify(err)}`);
    return false;
  }
});

Moralis.Cloud.define("getIfUsernameValid", async (request) => {
  return await isValidUsername(request.params.username, request.user.get("ethAddress"));
});

async function isValidUsername(username, ethAddress) {
  const logger = Moralis.Cloud.getLogger();

  var userQuery = new Moralis.Query("UserInfo");
  userQuery.equalTo("spectUsername", username);
  var user = await userQuery.first();
  if (user && user.get("ethAddress") !== ethAddress) {
    logger.info(`Username ${username} already in use`);
    return false;
  }

  return true;
}

async function getUserByUsername(username) {
  const logger = Moralis.Cloud.getLogger();

  try {
    var userQuery = new Moralis.Query("UserInfo");
    logger.info(`username ${username}`);
    userQuery.equalTo("spectUsername", username);
    var userInfo = await userQuery.first({ useMasterKey: true });

    const counts = await getUserStats(userInfo.get("ethAddress"));

    userInfo.set("completedBounties", counts.freelancedCount + counts.createdCount + counts.disputesWonCount);
    userInfo.set("freelancedBounties", counts.freelancedCount);
    userInfo.set("createdBounties", counts.createdCount);
    userInfo.set(
      "successRate",
      (100 *
        (counts.freelancedCount +
          counts.createdCount +
          counts.disputesWonCount +
          counts.acceptanceDeadlineViolationCount)) /
        (counts.freelancedCount +
          counts.createdCount +
          counts.completionDeadlineViolationCount +
          counts.acceptanceDeadlineViolationCount +
          counts.disputesLostCount +
          counts.disputesWonCount)
    );

    if (userInfo.get("organizationVerified")) {
      const organization = await getOrganization(userInfo.get("organizationId"));
      userInfo.set("organizationName", organization.get("name"));
    }

    await userInfo.save(null, { useMasterKey: true });

    return userInfo;
  } catch (err) {
    logger.error(`Failed to get user with error ${err}`);
    throw err;
  }
}
async function getOrganization(organizationId) {
  const query = new Moralis.Query("Organization");
  query.equalTo("objectId", organizationId);
  return await query.first();
}

Moralis.Cloud.define("getOrganizations", async (request) => {
  const pipeline = [{ sort: { organizationName: 1 } }];

  const query = new Moralis.Query("Organization");

  return await query.find(pipeline);
});
Moralis.Cloud.define(
  "getUser",
  async (request) => {
    const logger = Moralis.Cloud.getLogger();

    // Viewing other people's profile
    if (request.params.username) {
      return await getUserByUsername(request.params.username);
    }
    // Viewing my profile after username has been set
    else if (request.user.get("spectUsername")) {
      return await getUserByUsername(request.user.get("spectUsername"));
    } else {
      const userCheckQuery = new Moralis.Query("UserInfo");
      userCheckQuery.equalTo("ethAddress", request.user.get("ethAddress"));
      const existingUser = await userCheckQuery.first();

      // Viewing my profile when username is not set and wallet is not being connected for the first time
      if (existingUser) {
        return existingUser;
      }
      // Viewing my profile when wallet is being connected for the first time
      else {
        const userInfoQuery = new Moralis.Query("UserInfo");
        const userCount = await userInfoQuery.count();
        const newUsername = `anonymous${userCount + 1}`;

        const userInfo = new Moralis.Object("UserInfo");
        userInfo.set("spectUsername", newUsername);
        userInfo.set("name", `Anonymous User ${userCount + 1}`);
        userInfo.set("ethAddress", request.user.get("ethAddress"));

        var acl = new Moralis.ACL();
        acl.setPublicReadAccess(true);
        acl.setWriteAccess(request.user.id, true);

        userInfo.setACL(acl);
        const saveArray = [userInfo];
        try {
          await Moralis.Object.saveAll(saveArray, { useMasterKey: true });

          return userInfo;
        } catch (err) {
          logger.info(JSON.stringify(err));
        }
      }
    }
  },
  {
    fields: {},
  }
);

Moralis.Cloud.define("getUserFeedback", async (request) => {
  var bountyQuery = new Moralis.Query("Bounty");
  bountyQuery.equalTo("freelancer", request.user.get("ethAddress"));
  bountyQuery.select("freelancer", "clientUsername", "dealId", "review", "rating");
  const bounties = await bountyQuery.find();

  return bounties;
});

Moralis.Cloud.define("createProposal", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  var bountyQuery = new Moralis.Query("Bounty");
  bountyQuery.equalTo("dealId", request.params.dealId);
  try {
    var bounty = await bountyQuery.first();

    if (bounty) {
      bounty.increment("numApplicants");

      var proposal = new Moralis.Object("Proposal");
      proposal.set("dealId", request.params.dealId);
      proposal.set("status", 101);
      proposal.set("title", request.params.title);
      proposal.set("proposalText", request.params.proposalText);
      proposal.set("freelancerAddress", request.user.get("ethAddress"));
      proposal.set("freelancer", request.user.get("spectUsername"));
      proposal.set("lockedStake", parseFloat(request.params.lockedStake));
      proposal.set("deadline", new Date(request.params.deadline));
      proposal.set("revisions", parseInt(request.params.revisions));
      proposal.set("timeToRevise", parseInt(request.params.timeToRevise));

      var counts = await getUserStats(request.user.get("ethAddress"));
      proposal.set("failedJobs", counts.completionDeadlineViolationCount + counts.disputesLostCount);
      proposal.set("completedJobs", counts.freelancedCount + counts.acceptanceDeadlineViolationFreelancerCount);

      var acl = new Moralis.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(request.user.id, true);
      proposal.setACL(acl);

      let proposalId;
      await Moralis.Object.saveAll([bounty, proposal], {
        useMasterKey: true,
      }).then((res) => {
        proposalId = res[1].id;
      });
      const notification = await getNotificationObject(
        request.params.dealId,
        bounty.get("clientUsername"),
        request.user.get("spectUsername"),
        "submitted a proposal on",
        bounty.get("name"),
        0,
        proposalId
      );
      await notification.save(null, { useMasterKey: true });
      await sendEmail("submitProposal", proposal);

      return true;
    }
  } catch (err) {
    logger.error(`Error while creating proposal ${JSON.stringify(err)}`);
    return false;
  }
});

Moralis.Cloud.define("getProposals", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const sortOrder = request.params.sortOrder === "desc" ? -1 : 1;

  const pipeline = {
    match: {
      $expr: {
        $and: [{ $eq: ["$status", request.params.status] }, { $eq: ["$dealId", request.params.dealId] }],
      },
    },
    lookup: {
      from: "UserInfo",
      localField: "freelancerAddress",
      foreignField: "ethAddress",
      as: "user",
    },
    sort: {
      [request.params.sortBy]: sortOrder,
    },
  };

  const pipelineForFreelancer = {
    match: {
      $expr: {
        $and: [
          { $eq: ["$dealId", request.params.dealId] },
          { $eq: ["$freelancerAddress", request.user.get("ethAddress")] },
        ],
      },
    },
    lookup: {
      from: "UserInfo",
      localField: "freelancerAddress",
      foreignField: "ethAddress",
      as: "user",
    },
    sort: {
      [request.params.sortBy]: sortOrder,
    },
  };

  const pipelineWithoutStatus = {
    match: { dealId: request.params.dealId },
    lookup: {
      from: "UserInfo",
      localField: "freelancerAddress",
      foreignField: "ethAddress",
      as: "user",
    },
    sort: {
      [request.params.sortBy]: sortOrder,
    },
  };

  var proposalQuery = new Moralis.Query("Proposal");
  var bountyQuery = new Moralis.Query("Bounty");
  bountyQuery.equalTo("dealId", request.params.dealId);

  try {
    let res;
    var bounty = await bountyQuery.first();
    if (bounty.get("clientUsername") === request.user.get("spectUsername")) {
      if (request.params.status || request.params.status === 101) {
        res = await proposalQuery.aggregate(pipeline, { useMasterKey: true });
      } else {
        res = await proposalQuery.aggregate(pipelineWithoutStatus, {
          useMasterKey: true,
        });
      }
    } else {
      res = await proposalQuery.aggregate(pipelineForFreelancer, {
        useMasterKey: true,
      });
    }

    return res;
  } catch (err) {
    logger.error(`Error while getting proposals ${err}`);
    return false;
  }
});

Moralis.Cloud.define("getBounty", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  var bountyQuery = new Moralis.Query("Bounty");
  const pipeline = {
    match: { dealId: request.params.id },
    lookup: {
      from: "UserInfo",
      localField: "clientUsername",
      foreignField: "spectUsername",
      as: "user",
    },
  };

  var proposalQuery = new Moralis.Query("Proposal");
  const proposalPipeline = {
    match: {
      $expr: {
        $and: [{ $eq: ["$dealId", request.params.id] }, { $eq: ["$freelancer", request.user?.get("spectUsername")] }],
      },
    },
  };
  const proposalPipelineSelected = {
    match: {
      $expr: {
        $and: [{ $eq: ["$dealId", request.params.id] }, { $eq: ["$status", 103] }],
      },
    },
  };
  try {
    const res = await bountyQuery.aggregate(pipeline, { useMasterKey: true });
    if (request.user && res[0].clientUsername === request.user.get("spectUsername")) {
      res[0].proposal = await proposalQuery.aggregate(proposalPipelineSelected, {
        useMasterKey: true,
      });
    } else if (request.user) {
      res[0].proposal = await proposalQuery.aggregate(proposalPipeline, {
        useMasterKey: true,
      });
    }
    if (res[0].user[0].organizationVerified) {
      var orgQuery = new Moralis.Query("Organization");
      orgQuery.equalTo("objectId", res[0]?.user[0]?.organizationId);
      const org = await orgQuery.first();
      res[0].user[0]["organizationPicture"] = org.get("picture");
      res[0].user[0]["organizationName"] = org.get("name");
    }
    res[0].verifiableBounty = await getClientConfirmation(res[0].dealId);
    res[0].submissionTransaction = await getVerifiableSubmission(res[0].dealId);
    return res;
  } catch (err) {
    logger.error(`Error whilte getting bounty ${JSON.stringify(err)}`);
    return false;
  }
});

Moralis.Cloud.define("getProposal", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  var proposalQuery = new Moralis.Query("Proposal");
  const pipeline = {
    match: { objectId: request.params.id },
    lookup: {
      from: "UserInfo",
      localField: "freelancer",
      foreignField: "spectUsername",
      as: "user",
    },
  };

  try {
    let res = await proposalQuery.aggregate(pipeline, { useMasterKey: true });
    if (res.length > 0) {
      var bountyQuery = new Moralis.Query("Bounty");
      const bountyPipeline = {
        match: { dealId: res[0].dealId },
      };
      logger.info(`before ${JSON.stringify(res)}`);
      let bounty = await bountyQuery.aggregate(bountyPipeline, {
        useMasterKey: true,
      });
      logger.info(`after ${JSON.stringify(bounty)}`);

      res[0].bounty = bounty;
    }

    return res;
  } catch (err) {
    logger.error(`Error whilte getting proposal ${JSON.stringify(err)}`);
    return false;
  }
});

Moralis.Cloud.define("getMySubmittedProposals", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  var proposalQuery = new Moralis.Query("Proposal");
  const pipeline = {
    match: { freelancer: request.user.get("spectUsername") },
    lookup: {
      from: "Bounty",
      localField: "dealId",
      foreignField: "dealId",
      as: "bounty",
    },
  };

  const pipelineWithStatus = {
    match: {
      $expr: {
        $and: [
          { $eq: ["$status", request.params.status] },
          { $eq: ["$freelancer", request.user.get("spectUsername")] },
        ],
      },
    },

    lookup: {
      from: "Bounty",
      localField: "dealId",
      foreignField: "dealId",
      as: "bounty",
    },
  };

  try {
    let res;
    if (request.params.status) {
      res = await proposalQuery.aggregate(pipelineWithStatus, {
        useMasterKey: true,
      });
    } else {
      res = await proposalQuery.aggregate(pipeline, { useMasterKey: true });
    }

    for (var proposal of res) {
      if (proposal.bounty.length > 0) {
        var userQuery = new Moralis.Query("UserInfo");
        userQuery.equalTo("spectUsername", proposal.bounty[0].clientUsername);
        var user = await userQuery.first();
        proposal.user = user;
      }
    }
    return res;
  } catch (err) {
    logger.error(`Error whilte getting proposal ${JSON.stringify(err)}`);
    return false;
  }
});

//item can be proposal or bounty
async function sendEmail(stage, item) {
  const emailDetails = await getEmailDetails(stage, item);
  if (!emailDetails.to) {
    logger.info(`Email not provided`);
    return;
  }
  try {
    const res = Moralis.Cloud.sendEmail({
      from: "notifications@spect.network",
      fromname: "Spect Notifications",
      to: emailDetails.to,
      subject: emailDetails.subject,
      templateId: "d-29167d84858a4bbebd669512def5ee29",
      dynamic_template_data: {
        subject: emailDetails.subject,
        title: emailDetails.title,
        content: emailDetails.content,
        link: "https://app.spect.network/",
      },
    });
    logger.info(`Email res ${JSON.stringify(res)}`);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

//item can be proposal or bounty
async function getEmailDetails(stage, item) {
  var emailDetails = { to: null, subject: null, content: null };
  const userQuery = new Moralis.Query("User");

  if (stage === "createBounty") {
    userQuery.equalTo("spectUsername", item.get("clientUsername"));

    emailDetails.subject = "Created new gig!";
    emailDetails.title = "New Gig Confirmation";
    emailDetails.content = `Congrats! You created a new gig "${item.get("name")}" on Spect.`;
  } else if (stage === "submitProposal") {
    userQuery.equalTo("spectUsername", item.get("freelancer"));

    emailDetails.subject = "Submitted new proposal!";
    emailDetails.title = "New Proposal Confirmation";
    emailDetails.content = `Awesome! You have submitted a new proposal "${item.get("title")}" on Spect.`;
  } else if (stage === "acceptProposal") {
    userQuery.equalTo("spectUsername", item.get("freelancer"));
    emailDetails.subject = "Your proposal was accepted!";
    emailDetails.title = "Proposal Acceptance Confirmation";
    emailDetails.content = `Congrats! Your proposal "${item.get("title")}" was accepted.`;
  } else if (stage === "workSubmitted") {
    userQuery.equalTo("spectUsername", item.get("clientUsername"));
    emailDetails.subject = "New submission";
    emailDetails.title = "Submission Confirmation";
    emailDetails.content = `Your gig "${item.get("name")}" received a new submission.`;
  } else if (stage === "workAccepted") {
    userQuery.equalTo("spectUsername", item.get("freelancer"));
    emailDetails.subject = "Your submission was accepted!";
    emailDetails.title = "Submission Acceptance Confirmation";
    emailDetails.content = `Congrats! Your submission to "${item.get("name")}" was accepted.`;
  }

  const user = await userQuery.first({ useMasterKey: true });
  if (user.get("emailVerified")) {
    emailDetails.to = user.get("email");
  }

  return emailDetails;
}

Moralis.Cloud.define("getMyNotifications", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const notifQuery = new Moralis.Query("Notification");
  const pipeline = {
    match: {
      $expr: {
        $and: [{ $eq: ["$for", request.user.get("spectUsername")] }, { $eq: ["$cleared", false] }],
      },
    },
    lookup: {
      from: "UserInfo",
      localField: "actor",
      foreignField: "spectUsername",
      as: "user",
    },

    sort: {
      ["createdAt"]: -1,
    },
  };
  try {
    const notifs = await notifQuery.aggregate(pipeline, { useMasterKey: true });
    return notifs;
  } catch (err) {
    logger.error(err);
    return false;
  }
});

Moralis.Cloud.define("setNotifToInactive", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const notifQuery = new Moralis.Query("Notification");
  if (request.params.notifId) {
    notifQuery.equalTo("objectId", request.params.notifId);
    try {
      const notif = await notifQuery.first();
      notif.set("active", false);
      await notif.save(null, { useMasterKey: true });
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
});

Moralis.Cloud.define("clearNotifs", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const notifQuery = new Moralis.Query("Notification");
  let saveArray = [];
  notifQuery.equalTo("for", request.user.get("spectUsername"));
  try {
    const notifs = await notifQuery.find();
    for (var notif of notifs) {
      notif.set("cleared", true);
      saveArray.push(notif);
    }
    await Moralis.Object.saveAll(saveArray, { useMasterKey: true });
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
});

async function getUserStats(user) {
  const logger = Moralis.Cloud.getLogger();

  logger.info(`Getting user stats for user ${user}`);

  try {
    const freelancedBountyQuery = new Moralis.Query("FulfilledGig");
    freelancedBountyQuery.equalTo("freelancer", user);
    const freelancedCount = await freelancedBountyQuery.count();

    const createdBountyQuery = new Moralis.Query("FulfilledGig");
    createdBountyQuery.equalTo("client", user);
    const createdCount = await createdBountyQuery.count();

    const completionDeadlineQuery = new Moralis.Query("SubmissionDeadlineViolation");
    completionDeadlineQuery.equalTo("freelancer", user);
    const completionDeadlineViolationCount = await completionDeadlineQuery.count();

    const acceptanceDeadlineQuery = new Moralis.Query("AcceptanceDeadlineViolation");
    acceptanceDeadlineQuery.equalTo("client", user);
    const acceptanceDeadlineViolationCount = await acceptanceDeadlineQuery.count();

    const acceptanceDeadlineQueryFreelancer = new Moralis.Query("AcceptanceDeadlineViolation");
    acceptanceDeadlineQueryFreelancer.equalTo("client", user);
    const acceptanceDeadlineViolationFreelancerCount = await acceptanceDeadlineQueryFreelancer.count();

    const disputesQueryLoser = new Moralis.Query("ResolvedDispute");
    disputesQueryLoser.equalTo("loser", user);
    const disputesLostCount = await disputesQueryLoser.count();

    const disputesQueryWinner = new Moralis.Query("ResolvedDispute");
    disputesQueryWinner.equalTo("winner", user);
    const disputesWonCount = await disputesQueryWinner.count();

    return {
      freelancedCount: freelancedCount,
      createdCount: createdCount,
      completionDeadlineViolationCount: completionDeadlineViolationCount,
      acceptanceDeadlineViolationCount: acceptanceDeadlineViolationCount,
      disputesLostCount: disputesLostCount,
      disputesWonCount: disputesWonCount,
      acceptanceDeadlineViolationFreelancerCount: acceptanceDeadlineViolationFreelancerCount,
    };
  } catch (err) {
    logger.error(`Failed while gretting user stats with error ${err}`);
    throw `Failed while gretting user stats with error ${err}`;
  }
}

async function getNotificationObject(bountyId, notifFor, actor, action, title, actionId, proposalId) {
  const notification = new Moralis.Object("Notification");
  notification.set("dealId", bountyId);
  notification.set("proposalId", proposalId);
  notification.set("for", notifFor);
  notification.set("actor", actor);
  notification.set("action", action);
  notification.set("title", title);
  notification.set("actionId", actionId);

  return notification;
}

async function getVerifiableSubmission(dealId) {
  const submissionQuery = new Moralis.Query("SubmittedWork");
  submissionQuery.equalTo("dealId", dealId);
  try {
    const submission = await submissionQuery.first();

    return submission;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

async function getClientConfirmation(dealId) {
  const bountyQuery = new Moralis.Query("ClientConfirmation");
  bountyQuery.equalTo("dealId", dealId);
  try {
    const bounty = await bountyQuery.first();

    return bounty;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

Moralis.Cloud.define("setProposalStatus", async (request) => {
  const logger = Moralis.Cloud.getLogger();
  logger.info(request.params.id);
  var proposalQuery = new Moralis.Query("Proposal");
  proposalQuery.equalTo("objectId", request.params.id);

  try {
    var proposal = await proposalQuery.first({ useMasterKey: true });
    if (proposal) {
      proposal.set("status", parseInt(request.params.status));
    }
    await Moralis.Object.saveAll([proposal], { useMasterKey: true });
    return true;
  } catch (err) {
    logger.error(`Error whilte getting proposal ${JSON.stringify(err)}`);
    return false;
  }
});
