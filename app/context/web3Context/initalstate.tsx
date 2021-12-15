import { Contracts, UserStake } from "app/types";
import { ethers } from "ethers";

export interface State {
  loading: boolean;
  error?: Error;
  userStake?: UserStake;
  contracts?: Contracts;
  conversionRate?: number;
}

export const initialState: State = {
  loading: false,
};
