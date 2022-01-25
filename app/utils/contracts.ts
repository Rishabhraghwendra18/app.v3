import { toEther, fromWei } from "./utils";
import mumbaiUserAddress from "../constants/contracts/mumbai/user-address.json";
import mumbaiJobAddress from "../constants/contracts/mumbai/job-address.json";
import mumbaiOracleAddress from "../constants/contracts/mumbai/oracle-address.json";
import mumbaiWmaticAddress from "../constants/contracts/mumbai/wmatic-address.json";

import polygonUserAddress from "../constants/contracts/polygon/user-address.json";
import polygonJobAddress from "../constants/contracts/polygon/job-address.json";
import polygonOracleAddress from "../constants/contracts/polygon/oracle-address.json";
import polygonWmaticAddress from "../constants/contracts/polygon/wmatic-address.json";

import userABI from "../constants/contracts/mumbai/User.json";
import dealABI from "../constants/contracts/mumbai/Deal.json";
import oracleABI from "../constants/contracts/mumbai/Oracle.json";
import wmaticABI from "../constants/contracts/mumbai/Wmatic.json";
const ethers = require("ethers");

export function initializeMumbaiContracts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let dealContract = new ethers.Contract(
    mumbaiJobAddress.Deal,
    dealABI.abi,
    provider.getSigner()
  );
  let userContract = new ethers.Contract(
    mumbaiUserAddress.User,
    userABI.abi,
    provider.getSigner()
  );
  let tokenContract = new ethers.Contract(
    mumbaiWmaticAddress.Wmatic,
    wmaticABI.abi,
    provider.getSigner()
  );
  let oracleContract = new ethers.Contract(
    mumbaiOracleAddress.Oracle,
    oracleABI,
    provider.getSigner()
  );
  return {
    deal: dealContract,
    user: userContract,
    token: tokenContract,
    oracle: oracleContract,
  };
}

export function initializePolygonContracts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let dealContract = new ethers.Contract(
    polygonJobAddress.Deal,
    dealABI.abi,
    provider.getSigner()
  );
  let userContract = new ethers.Contract(
    polygonUserAddress.User,
    userABI.abi,
    provider.getSigner()
  );
  let tokenContract = new ethers.Contract(
    polygonWmaticAddress.Wmatic,
    wmaticABI.abi,
    provider.getSigner()
  );
  let oracleContract = new ethers.Contract(
    polygonOracleAddress.Oracle,
    oracleABI,
    provider.getSigner()
  );
  return {
    deal: dealContract,
    user: userContract,
    token: tokenContract,
    oracle: oracleContract,
  };
}

export async function listBounty(contract, reward, timeToAcceptInDays, gigCid) {
  const timeToAcceptInMinutes = timeToAcceptInDays * 24 * 60;
  const tx = await contract.listGig(
    toEther(reward.toString()),
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
  contract,
  revisions,
  timeToRevise
) {
  deadline = deadline.getTime() / 1000;
  const timeToReviseInMinutes = timeToRevise * 24 * 60;
  const tx = await contract.firstConfirmation(
    deadline,
    freelancer,
    toEther(lockedStake.toString()),
    dealId,
    bountyCid,
    timeToReviseInMinutes,
    revisions
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

export async function accept(dealId, contract, feedback) {
  const tx = await contract.accept(dealId, feedback);
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

export async function revise(dealId, instructions, contract) {
  const tx = await contract.revise(dealId, instructions);
  return tx.wait();
}
