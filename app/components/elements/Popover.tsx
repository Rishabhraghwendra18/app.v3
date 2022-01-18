import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

interface navbarItems {
  name: string;
  href: string;
  description?: string;
  icon?: React.ComponentType;
  authenticate?: number;
  id?: string;
}

interface Props {
  PopoverButton: React.ComponentType;
  items: Array<navbarItems>;
  documentation: boolean;
  small?: boolean;
}

const NavbarPopover: React.FC<Props> = ({
  PopoverButton,
  items,
  documentation,
  small = false,
}) => {
  const [show, setShow] = useState(false);
  const { authenticate, logout } = useMoralis();

  return (
    <Popover
      className="relative group flex flex-col justify-center items-center"
      onMouseLeave={() => setShow(false)}
    >
      {({ open }) => (
        <>
          <Popover.Button
            className="hidden md:flex flex-row items-center justify-center ml-8 font-bold bg-transparent"
            onMouseEnter={() => setShow(true)}
          >
            <PopoverButton />
          </Popover.Button>

          <Transition
            show={show}
            enter="transition duration-1000 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-500 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel
              static
              className={`${
                small ? "w-32" : "w-screen max-w-xs "
              } absolute z-10 transform -translate-x-1/2 left-1/2 sm:px-0`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 p-6 bg-blue-darkbg">
                  {items.map((item, idx) => (
                    <Link key={idx} href={item.href} passHref>
                      <div
                        className="flex items-center p-2 -m-3 transition duration-1000 ease-in-out rounded-lg hover:bg-grey-bluish focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 cursor-pointer"
                        id={item.id}
                        onClick={() => {
                          setShow(false);
                          if (item.authenticate) {
                            switch (item.authenticate) {
                              case 1:
                                authenticate();
                                break;
                              case 2:
                                authenticate({ provider: "walletconnect" });
                                break;
                              case 3:
                                logout();
                                break;
                              default:
                            }
                          }
                        }}
                      >
                        {item.icon && (
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white">
                            <item.icon />
                          </div>
                        )}
                        <div className="ml-4">
                          <p className="text-sm font-medium text-grey-light">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 text-blue-lighter">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {documentation && (
                  <div className="p-4 hover:bg-grey-bluish bg-blue-darkbg transform transition duration-1000">
                    <a
                      href="https://docs.spect.network"
                      className="flow-root px-2 transition duration-150 ease-in-out rounded-md focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="flex items-center ">
                        <span className="text-sm font-medium text-grey-light">
                          Documentation
                        </span>
                      </span>
                      <span className="block text-xs text-blue-lighter">
                        Check out our official docs for help
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NavbarPopover;
