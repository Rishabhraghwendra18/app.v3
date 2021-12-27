import Moralis from "moralis/types";

export interface Contracts {
  dealContract?: ethers.Contract;
  userContract?: ethers.Contract;
  tokenContract?: ethers.Contract;
  oracleContract?: ethers.Contract;
}

export interface UserStake {
  collateral?: number;
  deposit?: number;
  balance?: number;
  allowance?: boolean;
}

export interface User {
  completedBounties: number;
  createdBounties: number;
  crop: object;
  description: object;
  descriptionTitle: string;
  ethAddress: String;
  freelancedBounties: number;
  isInititialized: boolean;
  name: string;
  spectUsername: string;
  sucessRate: number;
  profilePicture: string;
  skills: Array<object>;
  _createdAt: object;
  _id: string;
  _updatedAt: object;
}

type GigStatus = 101 | 102 | 201 | 202 | 203 | 204 | 401 | 402 | 403;

export interface Gig {
  clientUsername: string;
  createdAt: string;
  deadline: Date;
  dealId: string;
  description: object;
  gigHash: string;
  minStake: number;
  name: string;
  numApplicants: number;
  objectId: string;
  revisions?: number;
  reward: number;
  status: GigStatus;
  tags: Array;
  timeToAcceptInDays: number;
  updatedAt: string;
  evidence?: string;
  user: Array<User>;
  verifiablegig?: Moralis.Object;
  submissionTransaction?: Moralis.Object;
  proposal: Array<Proposal>;
}

type ProposalStatus = 100 | 102 | 103 | 401;

export interface Proposal {
  completedJobs: number;
  createdAt: string;
  deadline: Date;
  dealId: string;
  failedJobs: number;
  freelancer: string;
  freelancerAddress: string;
  lockedStake: number;
  numRevisions?: number;
  objectId: string;
  proposalText: object;
  status: ProposalStatus;
  title: string;
  updatedAt: string;
  user: Array<User>;
}
