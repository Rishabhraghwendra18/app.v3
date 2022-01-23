import { Contracts, UserStake } from "app/types";
import Moralis from "moralis/types";

export interface State {
  loading: boolean;
  error?: Error;
  userStake?: UserStake;
  contracts?: Contracts;
  conversionRate?: number;
  userInfo?: Moralis.Object;
  organizations?: Moralis.Object;
}

export const initialState: State = {
  loading: false,
};
