import { Chip } from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Portfolio from "./portfolio";
import {
  animationVariant,
  exploreHelperTexts,
  profileHelperTexts,
} from "app/constants/constants";
import ProfileSkeleton from "./skeleton";
import { useProfile } from "pages/profile/[username]";
import { LightTooltip } from "app/components/elements/styledComponents";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {}

const ProfileInfo = (props: Props) => {
  const {
    profileUser: userInfo,
    profileUserStake: userStake,
    loading,
  } = useProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="grid gap-1 grid-cols-3 lg:gap-2 lg:grid-cols-7 mt-3 lg:mt-6">
        <div className="">
          <div className="text-sm md:text-sm text-blue-light" data-testid="collateral">
            <LightTooltip
              arrow
              placement="right"
              title={profileHelperTexts["minStake"]}
            >
              <span>Collateral</span>
            </LightTooltip>
          </div>
          <div className="flex flex-row" data-testid="collateralAmount">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.collateral?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light" data-testid="desposited">
            <LightTooltip
              arrow
              placement="right"
              title={profileHelperTexts["deposit"]}
            >
              <span>Deposited</span>
            </LightTooltip>
          </div>
          <div className="flex flex-row" data-testid="despositedAmount">
            <div className="text-base md:text-3xl mt-1">
              {userStake?.deposit?.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              WMatic
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light" data-testid="gigsCompletedTitle">
            Gigs Completed
          </div>
          <div className="text-base md:text-3xl mt-1" data-testid="NumberOfGigsCompleted">
            {userInfo?.get("createdBounties") || "-"}
          </div>
        </div>
        <div className="">
          <div className="text-sm md:text-sm text-blue-light" data-testid="gigsWorkedTitle">Gigs Worked</div>
          <div className="text-base md:text-3xl mt-1" data-testid="NumberOfGigsWorked">
            {userInfo?.get("freelancedBounties") || "-"}
          </div>
        </div>
        <div className="">
          <div className="text-sm text-blue-light" data-testid="successRateTitle">Success Rate</div>
          <div className="flex flex-row">
            <div className="text-base md:text-3xl mt-1" data-testid="PercentageSuccessRate">
              {userInfo?.get("successRate")?.toFixed(0) || "-"}
            </div>
            <div className="text-xs md:text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
              %
            </div>
          </div>
        </div>

        <div className="hidden lg:flex"></div>
        <div className="">
          <div className="text-sm text-left md:text-sm lg:text-right text-blue-light" data-testid="joinedOn">
            Joined On
          </div>
          <div className="text-base md:text-xl mt-1 lg:text-right font-bold" data-testid="joiningDate">
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
          <div className="text-base mt-4" data-testid="description">
            {userInfo?.get("description") && (
              <ReactQuill
                value={userInfo?.get("description")}
                readOnly={true}
                theme={"bubble"}
              />
            )}
          </div>
          {!userInfo?.get("description") &&
            !userInfo?.get("descriptionTitle") && (
              <div className="text-xl">You have not added your bio yet!</div>
            )}
        </div>
      </div>
      <Portfolio />
    </motion.main>
  );
};

export default ProfileInfo;
