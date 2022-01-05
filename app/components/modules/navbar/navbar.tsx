import NavbarPopover from "app/components/elements/Popover";
import { gigs, profile, proposals, wallets } from "app/constants/constants";
import { smartTrim } from "app/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Logo from "app/images/logo.png";
import { useGlobal } from "app/context/web3Context";
import { NavbarAvatar } from "app/components/elements/styledComponents";
import Notifications from "../../elements/notifications";

interface Props {}

export const Navbar = (props: Props) => {
  const { isAuthenticated, authenticate, isAuthenticating, user } =
    useMoralis();
  const {
    state: { userInfo, loading },
  } = useGlobal();
  useEffect(() => {
    profile[0].href = `/profile/${userInfo?.get("spectUsername")}`;
  }, [loading]);

  return (
    <div>
      <nav
        className="flex flex-row justify-between items-center text-black bg-clip-padding bg-opacity-0 mt-4 fadeIn-1 backdrop-filter backdrop-blur-lg sticky top-0 z-10 mb-3 px-12"
        role="navigation"
      >
        <div className="grid gap-1 grid-cols-6 w-full">
          <div className="flex flex-shrink-0 col-span-1">
            <Image src={Logo} alt="logo" height="48" width="140" />
          </div>
          <div className="hidden md:flex w-full flex-grow items-center pr-8 col-span-5">
            <div className="text-sm flex-grow flex font-bold">
              <div className="flex flex-col justify-center">
                <Link href="/" passHref>
                  <button className="hidden md:flex flex-col justify-center transform transition-colors ease-in-out duration-1000 rounded-l-full px-3 lg:px-5 bg-blue-lighter text-black-normal hover:text-white hover:bg-blue-bright border-r-1 border-gray-400 font-bold py-2">
                    Explore
                  </button>
                </Link>
              </div>
              <div className="flex flex-col justify-center">
                <Link href="/createGig" passHref>
                  <button
                    className="hidden md:flex flex-col justify-center transform transition-colors ease-in-out duration-1000 rounded-r-full px-2 lg:px-5 bg-blue-lighter text-black-normal hover:text-white hover:bg-blue-bright border-gray-400 font-bold py-2"
                    onClick={() => {
                      if (!isAuthenticated) {
                        authenticate();
                      }
                    }}
                  >
                    Create Gig
                  </button>
                </Link>
              </div>
              {isAuthenticated && (
                <NavbarPopover
                  items={gigs}
                  documentation={true}
                  PopoverButton={() => {
                    return (
                      <div className="flex flex-row">
                        <div className="hover:text-blue-bright">Gigs</div>
                        <div className="flex flex-col justify-center items-center text-gray-400 ml-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  }}
                />
              )}
              {isAuthenticated && (
                <NavbarPopover
                  items={proposals}
                  documentation={true}
                  PopoverButton={() => {
                    return (
                      <div className="flex flex-row">
                        <div className="hover:text-blue-bright">Proposals</div>
                        <div className="flex flex-col justify-center items-center text-gray-400 ml-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  }}
                />
              )}
            </div>
            {!isAuthenticated && (
              <NavbarPopover
                items={wallets}
                documentation={false}
                PopoverButton={() => {
                  return (
                    <button className="hidden md:flex flex-row rounded-full bg-blue-100 hover:text-white hover:bg-blue-bright font-bold transform transition-colors ease-in-out duration-1000">
                      <div className="flex flex-col justify-center items-center mt-2 text-sm block justify-end px-4 my-2 text-black-normal">
                        <span>
                          {!isAuthenticating
                            ? "Connect Wallet"
                            : "Authenticating"}
                        </span>
                      </div>
                    </button>
                  );
                }}
              />
            )}
            {isAuthenticated && <Notifications />}
            {isAuthenticated && (
              <NavbarPopover
                items={profile}
                documentation={false}
                small={true}
                PopoverButton={() => {
                  return (
                    <button className="hidden md:flex flex-row rounded-full bg-blue-100 hover:text-white hover:bg-blue-bright font-bold transform transition-colors ease-in-out duration-1000">
                      <NavbarAvatar src={userInfo?.get("profilePicture")} />
                      <div className="flex flex-col justify-center items-center mt-2 text-sm block justify-end px-4 mb-1 text-black-normal">
                        {smartTrim(user?.get("ethAddress"), 10)}
                      </div>
                    </button>
                  );
                }}
              />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
