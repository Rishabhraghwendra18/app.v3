import React, { useEffect } from "react";
import {
  initContractsAndUserStake,
  useGlobal,
} from "app/context/globalContext";
import { useMoralis } from "react-moralis";
import { Navbar } from "app/components/modules/navbar/navbar";
import { Footer } from "app/components/modules/footer/footer";
import {
  chainIdMapping,
  chainIdMappingDecimal,
  chainNameMapping,
  chainRPC,
} from "app/constants/constants";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { isAuthenticated, user, Moralis, isInitialized } = useMoralis();
  const { dispatch } = useGlobal();

  useEffect(() => {
    const checkNetworkAndAdd = async () => {
      if (
        window.ethereum.networkVersion !==
        chainIdMappingDecimal[process.env.NETWORK_CHAIN as string]
      ) {
        try {
          // check if the chain to connect to is installed
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              { chainId: chainIdMapping[process.env.NETWORK_CHAIN as string] },
            ],
          });
          initContractsAndUserStake(dispatch, user, Moralis);
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId:
                      chainIdMapping[process.env.NETWORK_CHAIN as string],
                    rpcUrls: [chainRPC[process.env.NETWORK_CHAIN as string]],
                    chainName:
                      chainNameMapping[process.env.NETWORK_CHAIN as string],
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC", // 2-6 characters long
                      decimals: 18,
                    },
                  },
                ],
              });
              initContractsAndUserStake(dispatch, user, Moralis);
            } catch (addError) {
              console.error(addError);
            }
          } else {
            alert("Network Switch denied please refresh");
          }
        }
      } else {
        initContractsAndUserStake(dispatch, user, Moralis);
      }
    };
    if (isAuthenticated && isInitialized) {
      checkNetworkAndAdd();
    }
  }, [isAuthenticated, isInitialized, Moralis, dispatch, user]);

  return (
    <div className="bg-blue-darkbg">
      <div className="relative min-h-screen flex-col w-full tracking-wide leading-normal antialiased  layout text-grey-light transform transition-colors ease-in-out duration-1000 hidden md:flex">
        <Navbar />
        <main className="flex-grow text-2xl">{children}</main>
        <Footer />
      </div>
      <div className="relative min-h-screen flex-col w-full tracking-wide leading-normal antialiased  layout text-grey-light transform transition-colors ease-in-out duration-1000 md:hidden flex">
        <span className="flex-grow text-xl mt-32 mx-4">
          We currently do not support mobile, please use desktop version
        </span>
        <Footer />
      </div>
    </div>
  );
};
