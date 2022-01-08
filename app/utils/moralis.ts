export function getUser(Moralis, username?: string) {
  const params = {
    username: username,
  };
  if (username) {
    return Moralis.Cloud.run("getUser", params);
  } else return Moralis.Cloud.run("getUser");
}

export async function uploadFile(Moralis, data) {
  const file = new Moralis.File(data.name, data);
  return file.saveIPFS();
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

export function setNotifToInactive(Moralis, notifId) {
  const params = {
    notifId: notifId,
  };
  return Moralis.Cloud.run("setNotifToInactive", params);
}

export function clearNotifs(Moralis) {
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

export function toIPFS(Moralis, sourceType: string, source: any) {
  const params = {
    sourceType: sourceType,
    source: source,
  };
  return Moralis.Cloud.run("toIpfs", params);
}
