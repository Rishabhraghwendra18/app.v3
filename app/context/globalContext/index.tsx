import React, { createContext, useReducer, useContext } from "react";
import { State, initialState } from "./initalstate";
import { Action, reducer } from "./reducer";
import { ethers } from "ethers";
import Moralis from "moralis/types";
import { Contracts } from "app/types";
import { getUser, getOrganizations } from "app/utils/moralis";
import { initializeMumbaiContracts, initializePolygonContracts } from "app/utils/contracts";

declare global {
  interface Window {
    ethereum: any;
  }
}

const GlobalContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

const initContractsAndUserStake = async (
  dispatch: React.Dispatch<Action>,
  user: Moralis.User | null,
  moralis: Moralis
) => {
  dispatch({ type: "START_ASYNC" });
  try {
    let oracleContract, tokenContract, userContract, dealContract;
    if (process.env.NETWORK_CHAIN === "polygon") {
      const { deal, user, token, oracle } = initializePolygonContracts();
      dealContract = deal;
      userContract = user;
      tokenContract = token;
      oracleContract = oracle;
    } else {
      const { deal, user, token, oracle } = initializeMumbaiContracts();
      dealContract = deal;
      userContract = user;
      tokenContract = token;
      oracleContract = oracle;
    }
    const conversionRate = await oracleContract.latestRoundData();
    const balance = await tokenContract.balanceOf(user?.get("ethAddress"));
    const deposit = await userContract.getDeposit(user?.get("ethAddress"));
    const collateral = await userContract.getCollateral(user?.get("ethAddress"));
    const allowance = await tokenContract.allowance(user?.get("ethAddress"), userContract.address);
    const userInfo = await getUser(moralis);
    const organizations = await getOrganizations(moralis);
    dispatch({
      type: "SET_USERINFO",
      value: userInfo,
    });
    dispatch({
      type: "SET_BALANCE",
      value: parseFloat(ethers.utils.formatEther(balance)),
    });
    dispatch({
      type: "SET_DEPOSIT",
      value: parseFloat(ethers.utils.formatEther(deposit)),
    });
    dispatch({
      type: "SET_COLLATERAL",
      value: parseFloat(ethers.utils.formatEther(collateral)),
    });
    dispatch({
      type: "SET_ALLOWANCE",
      value: parseInt(ethers.utils.formatEther(allowance)) !== 0,
    });
    dispatch({
      type: "SET_CONVERSION_RATE",
      value: conversionRate.answer.toNumber() / 10 ** 8,
    });
    dispatch({ type: "SET_DEAL_CONTRACT", contract: dealContract });
    dispatch({ type: "SET_USER_CONTRACT", contract: userContract });
    dispatch({ type: "SET_TOKEN_CONTRACT", contract: tokenContract });
    dispatch({ type: "SET_ORACLE_CONTRACT", contract: oracleContract });
    dispatch({ type: "SET_ORGANIZATIONS", value: organizations });
    dispatch({ type: "END_ASYNC" });
  } catch (error) {
    console.log(error);
    dispatch({ type: "SET_ERROR", error });
  }
};

const updateUserStake = async (dispatch: React.Dispatch<Action>, user: Moralis.User | null, contracts?: Contracts) => {
  dispatch({ type: "START_ASYNC" });
  try {
    const balance = await contracts?.tokenContract.balanceOf(user?.get("ethAddress"));
    const deposit = await contracts?.userContract.getDeposit(user?.get("ethAddress"));
    const collateral = await contracts?.userContract.getCollateral(user?.get("ethAddress"));
    const allowance = await contracts?.tokenContract.allowance(user?.get("ethAddress"), contracts.userContract.address);

    dispatch({
      type: "SET_BALANCE",
      value: parseFloat(ethers.utils.formatEther(balance)),
    });
    dispatch({
      type: "SET_DEPOSIT",
      value: parseFloat(ethers.utils.formatEther(deposit)),
    });
    dispatch({
      type: "SET_COLLATERAL",
      value: parseFloat(ethers.utils.formatEther(collateral)),
    });

    dispatch({
      type: "SET_ALLOWANCE",
      value: parseFloat(ethers.utils.formatEther(allowance)) !== 0,
    });
    dispatch({ type: "END_ASYNC" });
  } catch (error) {
    dispatch({ type: "SET_ERROR", error });
  }
};

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

const useGlobal = () => useContext(GlobalContext);

export default GlobalContextProvider;
export { useGlobal, initContractsAndUserStake, updateUserStake };
