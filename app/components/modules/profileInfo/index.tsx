import { Chip } from "@mui/material";
import { useGlobal } from "app/context/web3Context";
import dynamic from "next/dynamic";
import React from "react";
import { motion } from "framer-motion";
import Portfolio from "./portfolio";
import { animationVariant } from "app/constants/constants";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {}

const ProfileInfo = (props: Props) => {
  const {
    state: { userInfo, loading, userStake },
  } = useGlobal();
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="grid gap-1 grid-cols-3 lg:gap-2 lg:grid-cols-7 mt-3 lg:mt-6">
        <div className="">
          <div className="text-sm md:text-sm text-blue-light">Collateral</div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.collateral?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light">Deposited</div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.deposit?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light">
            Gigs Completed
          </div>
          <div className="text-base md:text-3xl mt-1">
            {userInfo?.get("createdBounties") || "-"}
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light">Gigs Worked</div>
          <div className="text-base md:text-3xl mt-1">
            {userInfo?.get("freelancedBounties") || "-"}
          </div>
        </div>
        <div className="">
          <div className="text-sm text-blue-light">Success Rate</div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1">
              {userInfo?.get("successRate")?.toFixed(0) || "-"}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              %
            </div>
          </div>
        </div>

        <div className="hidden lg:flex"></div>
        <div className="">
          <div className="text-sm text-left md:text-sm lg:text-right text-blue-light">
            Joined On
          </div>
          <div className="text-base md:text-xl mt-1 lg:text-right font-bold">
            {userInfo?.get("createdAt")?.toDateString()}
          </div>
        </div>
      </div>
      <div className="md:w-2/3 w-4/5 mt-8 lg:mt-10">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="text-2xl font-bold text-blue-bright">
              {userInfo?.get("descriptionTitle")}
            </div>
          </div>
          <div className="w-full text-base mt-4">
            <div className="grid grid-cols-5 gap-2">
              {userInfo?.get("skills")?.map((skill, idx) => {
                return (
                  <Chip
                    label={skill.label}
                    key={idx}
                    size="small"
                    sx={{
                      mt: 1,
                      mr: 0.8,
                      textTransform: "none",
                      color: "#99ccff",
                      fontSize: "0.7rem",
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="text-base mt-4">
            <ReactQuill
              value={userInfo?.get("description") || ""}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
        </div>
      </div>
      <Portfolio />
    </motion.main>
  );
};

export default ProfileInfo;
