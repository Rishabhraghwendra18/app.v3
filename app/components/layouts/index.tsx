import React, { useEffect, useState } from "react";
import { initContractsAndUserStake, useWeb3 } from "app/context/web3Context";
import { useMoralis } from "react-moralis";
import { Navbar } from "app/components/modules/navbar/navbar";
import { Footer } from "app/components/modules/footer/footer";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { isAuthenticated, user } = useMoralis();
  const {
    state: { error, contracts, userStake },
    dispatch,
  } = useWeb3();

  useEffect(() => {
    if (isAuthenticated) {
      initContractsAndUserStake(dispatch, user);
    }
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-screen flex flex-col w-full tracking-wide leading-normal antialiased bg-blue-darkbg layout text-grey-light transform transition-colors ease-in-out duration-1000 hidden md:flex">
      <Navbar />
      <main className="flex-grow text-2xl">{children}</main>
      <Footer />
    </div>
  );
};
