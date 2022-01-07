export function getUser(Moralis, username?: string) {
  const params = {
    username: username,
  };
  if (username) {
    return Moralis.Cloud.run("getUser", params);
  } else return Moralis.Cloud.run("getUser");
}

// export function initUser() {
//   return Moralis.Cloud.run("initUser");
// }

export async function uploadFile(data, Moralis) {
  const file = new Moralis.File(data.name, data);
  return file.saveIPFS();
}

// export function getIfUsernameValid(username) {
//   const params = {
//     username: username,
//   };
//   return Moralis.Cloud.run("getIfUsernameValid", params);
// }

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

export function getMyNotifications(Moralis) {
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

export function toIPFS(sourceType: string, source: any) {
  const params = {
    sourceType: sourceType,
    source: source,
  };
  return Moralis.Cloud.run("toIpfs", params);
}
