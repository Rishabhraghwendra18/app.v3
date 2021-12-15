import { smartTrim } from "app/utils/utils";
import Image from "next/image";
import React from "react";
import { useMoralis } from "react-moralis";
import Logo from "../../../images/logo.png";

interface Props {}

export const Navbar = (props: Props) => {
  const { isAuthenticated, authenticate, isAuthenticating, user, logout } =
    useMoralis();
  return (
    <div>
      <nav
        className="flex flex-row justify-between items-center text-black bg-clip-padding bg-opacity-0 mt-4 fadeIn-1 backdrop-filter backdrop-blur-lg sticky top-0 z-10 mb-3 px-12"
        role="navigation"
      >
        <Image src={Logo} alt="logo" height="48" width="140" />
        {!isAuthenticated && (
          <button
            className="hidden md:flex flex-row rounded-full bg-blue-100 hover:text-white hover:bg-blue-spectbright font-bold transform transition-colors ease-in-out duration-1000"
            onClick={() => {
              authenticate();
            }}
          >
            <div className="flex flex-col justify-center items-center mt-2 text-sm block justify-end px-4 mb-1 text-black-normal">
              {!isAuthenticating && <span>Connect Wallet</span>}
              {isAuthenticating && <span>Loading</span>}
            </div>
          </button>
        )}
        {isAuthenticated && (
          <button
            className="hidden md:flex flex-row rounded-full bg-blue-100 hover:text-white hover:bg-blue-spectbright font-bold transform transition-colors ease-in-out duration-1000"
            onClick={() => {
              logout();
            }}
          >
            <div className="flex flex-col justify-center items-center mt-2 text-sm block justify-end px-4 mb-1 text-black-normal">
              {smartTrim(user?.get("ethAddress"), 8)}
            </div>
          </button>
        )}
      </nav>
    </div>
  );
};
