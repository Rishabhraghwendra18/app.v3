import { BigNumber } from "ethers";
import Moralis from "moralis/types";
import { Delta } from "quill";

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
  _created_at: any;
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
  revisions: number;
  timeToRevise: number;
  reward: number;
  status: GigStatus;
  tags: Array;
  timeToAcceptInDays: number;
  updatedAt: string;
  evidence?: string;
  user: Array<User>;
  verifiableBounty?: Moralis.Object;
  submissionTransaction?: Moralis.Object;
  submissions: string[];
  proposal: Array<Proposal>;
  revisionInstructions: string[];
}

type ProposalStatus = 101 | 102 | 103 | 401;

export interface Proposal {
  completedJobs: number;
  createdAt: string;
  deadline: Date;
  dealId: string;
  failedJobs: number;
  freelancer: string;
  freelancerAddress: string;
  lockedStake: number;
  revisions: number;
  timeToRevise: number;
  objectId: string;
  proposalText: object;
  status: ProposalStatus;
  title: string;
  updatedAt: string;
  user: any; // fix
  bounty: Gig[];
}

export interface ContractGig {
  active: boolean;
  client: string;
  collateral: BigNumber;
  confirmationDeadlineViolation: boolean;
  confirmed: boolean;
  deadline: Array<object | string> | any;
  freelancer: string;
  gigCid: string;
  inDispute: ConstrainBoolean;
  numRevisionsRemaining: number;
  reward: BigNumber;
  submission: string;
  timeToAcceptInMinuted: number;
  timeToReviseInMinutes: number;
}

export interface VerifiedGig {
  description: object;
  name: string;
  proposal: object;
  proposalTitle: string;
  revisions?: number;
  tags: Array<string>;
}

export interface Submission {
  links: {
    name: string;
    link: string;
  }[];
  submissionText?: Delta;
  submissionFile?: string;
  submissionFilename?: string;
}

export interface Notification {
  action: string;
  actionId: 1 | 2 | 3 | 4 | 5 | 6;
  active: boolean;
  actor: string;
  cleared: boolean;
  createdAt: string;
  dealId: string;
  for: string;
  objectId: string;
  proposalId: string;
  title: string;
  updatedAt: string;
  user: User[];
}

export type Moralis = Moralis;
