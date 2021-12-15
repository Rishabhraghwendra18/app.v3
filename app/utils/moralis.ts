const Moralis = require("moralis");

Moralis.initialize(process.env.MORALIS_APPLICATION_ID);
Moralis.serverURL = process.env.MORALIS_SERVER_ID;

// export function createBounty(
//   name,
//   tags,
//   description,
//   reward,
//   minStake,
//   deadline,
//   timeToAcceptInDays,
//   dealId
// ) {
//   let tagArray = [];
//   tags.map((t) => tagArray.push(t.value));
//   const params = {
//     name: name,
//     tags: tagArray,
//     description: description,
//     reward: reward,
//     minStake: minStake,
//     deadline: deadline,
//     acceptanceDeadline: new Date(),
//     timeToAcceptInDays: timeToAcceptInDays,
//     dealId: dealId,
//   };
//   return Moralis.Cloud.run("createBounty", params);
// }

export function createProposal(
  dealId,
  title,
  proposalText,
  lockedStake,
  deadline
) {
  const params = {
    dealId: dealId,
    title: title,
    proposalText: proposalText,
    lockedStake: lockedStake,
    deadline: deadline,
  };
  return Moralis.Cloud.run("createProposal", params);
}

export function getUser(username) {
  const params = {
    username: username,
  };
  if (username) {
    return Moralis.Cloud.run("getUser", params);
  } else return Moralis.Cloud.run("getUser");
}

export function initUser() {
  return Moralis.Cloud.run("initUser");
}

export async function uploadFile(data) {
  const file = new Moralis.File(data.name, data);
  return file.saveIPFS();
}

export async function filterJobs(
  mainFilter,
  jobTypeFilter,
  lockedStakeFilter,
  deadlineFilter,
  sortBy,
  sortOrder
) {
  var dateLowerBound = new Date(
    new Date().getTime() + deadlineFilter[0] * 24 * 60 * 60 * 1000
  );
  var dateUpperBound = new Date(
    new Date().getTime() + deadlineFilter[1] * 24 * 60 * 60 * 1000
  );

  const params = {
    ethAddress: "0x92d202402068108f3301e3c0bcf8b77f4a94a2a7",
    mainFilter: mainFilter,
    jobType: jobTypeFilter,
    lockedStake: lockedStakeFilter,
    deadlineFilter: [dateLowerBound, dateUpperBound],
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  const res = await Moralis.Cloud.run("filterJobsNew", params);

  return res;
}

export async function filterMyBounties(status, sortBy, sortOrder) {
  const params = {
    status: status,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  const res = await Moralis.Cloud.run("filterMyBounties", params);

  return res;
}

export async function filterBounties() {
//   tags,
//   lockedStakeFilter,
//   sortBy,
//   sortOrder
  const params = {
    tags: [],
    lockedStake: [0, 99999],
    sortBy: "reward",
    sortOrder: "desc",
  };

  //   function filterByDate(item) {
  //     const today = new Date();
  //     const min = new Date(today);
  //     min.setDate(min.getDate() + deadlineFilter[0]);
  //     const max = new Date(today);
  //     max.setDate(min.getDate() + deadlineFilter[1]);
  //     if (item.deadline > min && item.deadline < max) {
  //       return true;
  //     }
  //     return false;
  //   }
  //   const res = await Moralis.Cloud.run("filterBounties", params);
  return Moralis.Cloud.run("filterBounties", params);

  //   return res.filter(filterByDate);
}

export function getIfUsernameValid(username) {
  const params = {
    username: username,
  };
  return Moralis.Cloud.run("getIfUsernameValid", params);
}

export function getBounty(id) {
  const params = {
    id: id,
  };
  return Moralis.Cloud.run("getBounty", params);
}

export function getMyProposals(dealId, status, sortOrder, sortBy) {
  const params = {
    dealId: dealId,
    status: status,
    sortOrder: sortOrder,
    sortBy: sortBy,
  };
  return Moralis.Cloud.run("getProposals", params);
}

export function getProposal(id) {
  const params = {
    id: id,
  };
  return Moralis.Cloud.run("getProposal", params);
}

export function setProposalStatus(proposalId, status) {
  const params = {
    id: proposalId,
    status: status,
  };
  return Moralis.Cloud.run("setProposalStatus", params);
}

export function getMySubmittedProposals(status) {
  const params = {
    status: status,
  };
  return Moralis.Cloud.run("getMySubmittedProposals", params);
}

export function startBounty(id) {
  const params = {
    id: id,
  };
  return Moralis.Cloud.run("startBounty", params);
}

export function updateBountyStatus(id, status, comments, fileName) {
  const params = {
    id: id,
    status: status,
    submissionText: comments,
    submissionFile: fileName,
  };
  return Moralis.Cloud.run("updateBountyStatus", params);
}

function forceDownload(blob, filename) {
  var a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  // For Firefox https://stackoverflow.com/a/32226068
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Current blob size limit is around 500MB for browsers
export async function downloadImage(url, filename) {
  if (!filename) filename = url.split("\\").pop().split("/").pop();
  fetch(url, {
    headers: new Headers({
      Origin: (Location as any).origin,
    }),
    mode: "cors",
  })
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch((e) => console.error(e));
}

export function getMyNotifications() {
  return Moralis.Cloud.run("getMyNotifications");
}

export function setNotifToInactive(notifId) {
  const params = {
    notifId: notifId,
  };
  return Moralis.Cloud.run("setNotifToInactive", params);
}

export function clearNotifs() {
  return Moralis.Cloud.run("clearNotifs");
}

// export async function uploadMetadataToIPFS(bounty) {
//   const file = new Moralis.File(bounty.id, {
//     base64: btoa(JSON.stringify(bounty)),
//   });
//   return file.saveIPFS();
// }

export async function fetchFromIPFS(ipfsHash) {
  const url = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
  const response = await fetch(url);
  return response.json();
}

export async function getVerifiableBounty(dealId) {
  return Moralis.Cloud.run("getVerifiableBounty", { dealId: dealId });
}

export async function getVerifiableSubmission(dealId) {
  return Moralis.Cloud.run("getVerifiableSubmission", { dealId: dealId });
}

export function toIPFS(sourceType, source) {
  const params = {
    sourceType: sourceType,
    source: source,
  };
  return Moralis.Cloud.run("toIpfs", params);
}
