import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { useGlobal } from "app/context/web3Context";
import React from "react";
import WrapTextIcon from "@mui/icons-material/WrapText";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { motion } from "framer-motion";
import { animationVariant } from "app/constants/constants";

interface Props {}

const DepositManagement = (props: Props) => {
  const {
    state: { userStake },
  } = useGlobal();
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="grid gap-1 grid-cols-3 lg:gap-2 lg:grid-cols-7">
        <div className="mt-3 lg:mt-6">
          <div className="text-sm md:text-sm text-blue-light">
            Collateral Locked
          </div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.collateral?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-gray-400 flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="mt-3 lg:mt-6">
          <div className="text-sm md:text-sm text-blue-light">
            Deposited Funds
          </div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.deposit?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-gray-400 flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="mt-3 lg:mt-6">
          <div className="text-sm md:text-sm text-blue-light">
            Available Funds
          </div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.balance?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-gray-400 flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="col-span-4 rounded-3xl mt-3">
          <div className="flex flex-col w-full">
            <div className="flex flex-row mt-6 w-full">
              <PrimaryButton
                variant="outlined"
                endIcon={<WrapTextIcon />}
                fullWidth
                sx={{ marginRight: 5 }}
              >
                Wrap Matic
              </PrimaryButton>
              <PrimaryButton
                variant="outlined"
                endIcon={<MenuOpenIcon />}
                fullWidth
                sx={{ marginRight: 5 }}
              >
                Unwrap Matic
              </PrimaryButton>
            </div>
          </div>
          <div className="w-full flex items-center text-blue-bright text-base py-3 rounded-xl">
            <p>
              You need to Wrap matic to be able to create Gig or deposit
              collateral
            </p>
          </div>
        </div>
      </div>
      <div className="border-1 border-blue-200 mt-8 rounded-xl">
        <div className="w-full bg-blue-100 dark:bg-blue-spectlight rounded-t-xl py-2 border-b-1 border-blue-200">
          <span className="ml-8 text-blue-500 dark:text-blue-spectbright font-bold my-3">
            Deposit management
          </span>
        </div>
        <div className="grid gap-3 grid-cols-2 px-16 py-8">
          <div className="flex flex-col">
            <div className="mt-3 lg:mt-6 flex flex-row">
              <div className="flex flex-col w-1/3">
                <div className="text-sm md:text-sm text-blue-light">
                  Available Funds
                </div>
                <div className="flex flex-row">
                  <div className="text-base md:text-3xl mt-1">
                    {userStake?.balance?.toFixed(2)}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 flex flex-col justify-end items-end ml-1 mb-1">
                    WMatic
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-2/3">
                <PrimaryButton
                  variant="contained"
                  endIcon={<AccountBalanceIcon />}
                  fullWidth
                >
                  Deposit
                </PrimaryButton>
              </div>
            </div>
            <div
              className="w-full mt-4 flex items-center text-blue-bright text-base rounded-xl"
              role="alert"
            >
              <p>
                Deposit WMatic to work on a gig. Collateral amount for a gig
                will be locked from this deposit.
              </p>
            </div>
          </div>
          <div className="mt-3 lg:mt-6 flex flex-row">
            <div className="flex flex-col w-2/3 lg:w-1/3 ml-4 lg:ml-8">
              <div className="text-sm md:text-sm text-blue-light">
                Unlocked deposit
              </div>
              <div className="flex flex-row">
                <div className="text-base md:text-3xl mt-1">
                  {userStake?.deposit && userStake?.collateral
                    ? (userStake?.deposit - userStake?.collateral).toFixed(2)
                    : 0}
                </div>
                <div className="text-xs md:text-sm text-gray-400 flex flex-col justify-end items-end ml-1 mb-1">
                  WMatic
                </div>
              </div>
            </div>
            <div className="w-2/3 ">
              <PrimaryButton
                variant="contained"
                endIcon={<AccountBalanceWalletIcon />}
                fullWidth
              >
                Withdraw
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default DepositManagement;
