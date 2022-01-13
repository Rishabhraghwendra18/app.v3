import React, { useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { NavbarAvatar } from "app/components/elements/styledComponents";
import {
  clearNotifs,
  getMyNotifications,
  setNotifToInactive,
} from "app/utils/moralis";
import { useMoralis } from "react-moralis";
import { Notification } from "app/types";
import { actionIdToTabMap } from "app/constants/constants";
import { Button } from "@mui/material";

interface Props {}

const Notifications = (props: Props) => {
  const [show, setShow] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([] as Notification[]);
  const [numActiveNotifs, setNumActiveNotifs] = useState(0);

  const { isAuthenticated, Moralis } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      getMyNotifications(Moralis).then((res: Notification[]) => {
        setNotifs(res.reverse());
        setNumActiveNotifs(res.filter((n) => n.active === true).length);
      });
    }
  }, [isAuthenticated]);

  return (
    <Popover className="relative group" onMouseLeave={() => setShow(false)}>
      {({ open }) => (
        <>
          <Popover.Button
            className="hidden md:flex flex flex-row font-bold justify-center items-center ml-5 px-2 text-gray-400 rounded-full bg-transparent bNotifications"
            onMouseEnter={() => setShow(true)}
          >
            {show === true && (
              <div className="flex flex-col justify-center ml-1 text-blue-bright">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 lg:h-7 lg:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            )}
            {show === false && (
              <div className="flex flex-col justify-center ml-1 hover:text-blue-bright">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 lg:h-7 lg:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            )}
            {numActiveNotifs > 0 && (
              <i className="fas fa-circle flex flex-col mb-8 text-blue-bright text-2xs animate-pulse"></i>
            )}
            {numActiveNotifs === 0 && (
              <i className="fas fa-circle flex flex-col mb-8 text-blue-bright text-xs opacity-0"></i>
            )}
          </Popover.Button>

          <Transition
            show={show}
            enter="transition duration-1000 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-1000 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel
              static
              className="absolute z-10 w-screen max-w-sm transform -translate-x-1/2 left-1/2 sm:px-0"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-4 p-7 max-h-96 overflow-y-auto scrollbar bg-blue-darkbg">
                  {notifs.length === 0 && (
                    <div className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-base">
                      You have no new notifications
                    </div>
                  )}

                  {notifs.map((item, index) => (
                    <div
                      className="flex flex-row"
                      key={index}
                      onClick={() => {
                        setShow(false);
                        item.active = false;
                        setNotifs(notifs);
                        setNumActiveNotifs(numActiveNotifs - 1);
                        setNotifToInactive(Moralis, item.objectId);
                      }}
                    >
                      <Link
                        href={{
                          pathname: `/gig/${item.dealId}`,
                          query: {
                            tab: actionIdToTabMap[item.actionId],
                            proposal: item.proposalId,
                          },
                        }}
                        as={`/gig/${item.dealId}`}
                        passHref
                      >
                        <div className="flex items-center p-2 -m-2 ease-in-out rounded-lg hover:bg-grey-bluish focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 cursor-pointer transform transition-colors ease-in-out duration-1000 w-full">
                          <NavbarAvatar src={item.user[0]?.profilePicture} />

                          <div className="ml-4">
                            <p className="text-sm">
                              {item.actor}{" "}
                              <span className="text-green-bright">
                                {item.action}
                              </span>{" "}
                              <span>{item.title}</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                      {item.active === true && (
                        <i className="fas fa-circle flex flex-col justify-center text-blue-bright text-xs"></i>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-darkbg">
                  <div className="flow-root px-2 py-2 ease-in-out rounded-md focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 transform transition-colors ease-in-out duration-1000">
                    <span className="flex items-center">
                      <Button
                        onClick={() => {
                          clearNotifs(Moralis).then((res) => {
                            setNotifs([]);
                            setNumActiveNotifs(0);
                          });
                        }}
                        fullWidth
                        sx={{ textTransform: "none" }}
                      >
                        Clear Notifications
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Notifications;
