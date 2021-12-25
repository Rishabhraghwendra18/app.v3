import { toEther, fromWei } from "./utils";
const ethers = require("ethers");

export async function listBounty(contract, reward, timeToAcceptInDays, gigCid) {
  const timeToAcceptInMinutes = timeToAcceptInDays * 24 * 60;
  const tx = await contract.listGig(
    toEther(reward),
    timeToAcceptInMinutes,
    gigCid
  );
  return tx.wait();
}

export async function delistGig(contract, dealId) {
  const tx = await contract.delistGig(dealId);
  return tx.wait();
}

export async function getPrice(contract) {
  const roundData = await contract.latestRoundData();
  return roundData?.answer?.toNumber() / 10 ** 8;
}

export async function firstConfirmation(
  deadline,
  freelancer,
  lockedStake,
  dealId,
  bountyCid,
  contract
) {
  deadline = deadline.getTime() / 1000;
  const revision = 0;
  const timeToReviseInMinutes = 120;
  const tx = await contract.firstConfirmation(
    deadline,
    freelancer,
    toEther(lockedStake.toString()),
    dealId,
    bountyCid,
    timeToReviseInMinutes,
    revision
  );
  return tx.wait();
}

export async function getDealMetadata(dealId, contract) {
  return contract.getDeal(dealId);
}

export async function getReward(dealId, contract) {
  contract.getReward(dealId).then((res) => {
    return parseInt(fromWei(res));
  });
}

export async function getDeposit(dealId, contract) {
  contract.getDeposit(dealId).then((res) => {
    return parseInt(fromWei(res));
  });
}

export async function secondConfirmation(dealId, contract) {
  const tx = await contract.secondConfirmation(dealId);
  return tx.wait();
}

export async function addToStake(contract, stake) {
  const tx = await contract.deposit(toEther(stake.toString()));
  return tx.wait();
}

export async function removeStake(contract, stake) {
  const tx = await contract.withdraw(toEther(stake.toString()));
  return tx.wait();
}

export async function wrapMatic(contract, value) {
  const tx = await contract.deposit({ value: toEther(value.toString()) });
  return tx.wait();
}

export async function unWrapMatic(contract, value) {
  const tx = await contract.withdraw(toEther(value.toString()));
  return tx.wait();
}

export async function approve(contract, address) {
  const tx = await contract.approve(
    address,
    toEther(Number.MAX_SAFE_INTEGER.toString())
  );
  return tx.wait();
}

export async function submitContract(dealId, submission, contract) {
  const tx = await contract.submit(dealId, submission);
  return tx.wait();
}

export async function accept(dealId, contract) {
  const rating = 5;
  const tx = await contract.accept(dealId, rating);
  return tx.wait();
}

export async function callAcceptanceDeadlineViolation(dealId, contract) {
  const tx = await contract.callAcceptanceDeadlineViolation(dealId);
  return tx.wait();
}

export async function callSubmissionDeadlineViolation(dealId, contract) {
  const tx = await contract.callSubmissionDeadlineViolation(dealId);
  return tx.wait();
}

export async function callConfirmationDeadlineViolation(dealId, contract) {
  const tx = await contract.callConfirmationDeadlineViolation(dealId);
  return tx.wait();
}

export async function callDispute(dealId, dispute, contract) {
  const tx = await contract.callDispute(dealId, dispute);
  return tx.wait();
}
