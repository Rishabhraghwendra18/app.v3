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
  ethAddress: String;
  freelancerBounties: number;
  isInititialized: boolean;
  name: string;
  spectUsername: string;
  sucessRate: number;
  _createdAt: object;
  _id: string;
  _updatedAt: object;
}

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
  status: number;
  tags: Array;
  timeToAcceptInDays: number;
  updatedAt: string;
  user: User;
}
