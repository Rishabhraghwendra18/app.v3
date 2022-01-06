import { Contracts, UserStake } from "app/types";
import { State } from "./initalstate";

export type Action =
  | {
      type: "START_ASYNC";
    }
  | {
      type: "SET_ERROR";
      error: State["error"];
    }
  | {
      type: "SET_DEAL_CONTRACT";
      contract: Contracts["dealContract"];
    }
  | {
      type: "SET_USER_CONTRACT";
      contract: Contracts["userContract"];
    }
  | {
      type: "SET_TOKEN_CONTRACT";
      contract: Contracts["tokenContract"];
    }
  | {
      type: "SET_ORACLE_CONTRACT";
      contract: Contracts["oracleContract"];
    }
  | {
      type: "SET_BALANCE";
      value: UserStake["balance"];
    }
  | {
      type: "SET_DEPOSIT";
      value: UserStake["deposit"];
    }
  | {
      type: "SET_COLLATERAL";
      value: UserStake["collateral"];
    }
  | {
      type: "SET_ALLOWANCE";
      value: UserStake["allowance"];
    }
  | {
      type: "SET_CONVERSION_RATE";
      value: State["conversionRate"];
    }
  | {
      type: "SET_USERINFO";
      value: State["userInfo"];
    }
  | {
      type: "END_ASYNC";
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "START_ASYNC": {
      return {
        ...state,
        loading: true,
      };
    }
    case "END_ASYNC": {
      return {
        ...state,
        loading: false,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case "SET_DEAL_CONTRACT": {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          dealContract: action.contract,
        },
      };
    }
    case "SET_CONVERSION_RATE": {
      return {
        ...state,
        conversionRate: action.value,
      };
    }
    case "SET_USER_CONTRACT": {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          userContract: action.contract,
        },
      };
    }
    case "SET_TOKEN_CONTRACT": {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          tokenContract: action.contract,
        },
      };
    }
    case "SET_ORACLE_CONTRACT": {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          oracleContract: action.contract,
        },
      };
    }
    case "SET_BALANCE": {
      return {
        ...state,
        userStake: {
          ...state.userStake,
          balance: action.value,
        },
      };
    }
    case "SET_DEPOSIT": {
      return {
        ...state,
        userStake: {
          ...state.userStake,
          deposit: action.value,
        },
      };
    }
    case "SET_COLLATERAL": {
      return {
        ...state,
        userStake: {
          ...state.userStake,
          collateral: action.value,
        },
      };
    }
    case "SET_ALLOWANCE": {
      return {
        ...state,
        userStake: {
          ...state.userStake,
          allowance: action.value,
        },
      };
    }
    case "SET_USERINFO": {
      return {
        ...state,
        userInfo: action.value,
      };
    }
    default:
      throw new Error("Bad action type");
  }
};
