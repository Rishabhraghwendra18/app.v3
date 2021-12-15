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
