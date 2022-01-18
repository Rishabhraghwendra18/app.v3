import Image from "next/image";
import React from "react";
import Logo from "../../../images/logo.png";

interface Props {}

export const Footer = (props: Props) => {
  return (
    <div className="flex flex-row w-full mb-2 px-2 md:px-12">
      <div className="w-1/4 md:w-1/2">
        <Image src={Logo} alt="logo" height="48" width="140" />
      </div>
      <div className="w-full flex items-center pr-8">
        <div className="flex-grow"></div>
        <div>
          <div className="flex flex-row text-xs lg:text-base w-full">
            <div className="mx-4 md:mx-8 transform transition-colors ease-in-out duration-1000 hover:text-blue-bright rounded-lg">
              <a
                href="https://discord.gg/vXT9QNM9pS"
                target="_blank"
                rel="noreferrer"
              >
                Contact Support
              </a>
            </div>
            <div className="md:mx-8 transform transition-colors ease-in-out duration-1000 hover:text-blue-bright rounded-lg">
              <a
                href="https://spect.gitbook.io/spect-docs/"
                target="_blank"
                rel="noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
