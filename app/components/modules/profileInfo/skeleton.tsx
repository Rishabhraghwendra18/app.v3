import { Grow, Skeleton } from "@mui/material";
import { useProfile } from "pages/profile/[username]";
import React from "react";

interface Props {}

const ProfileSkeleton = (props: Props) => {
  const { loading } = useProfile();
  return (
    <Grow in={loading} timeout={500}>
      <div className="flex flex-col">
        <div>
          <div className="grid gap-1 grid-cols-3 lg:gap-2 lg:grid-cols-7 mt-3 lg:mt-6">
            <div className="">
              <div className="text-sm md:text-sm text-blue-light">
                Collateral
              </div>

              <div className="flex flex-row">
                <div className="text-base md:text-3xl mt-1 w-1/3">
                  <Skeleton height={36} width={`100%`} animation="wave" />
                </div>
                <div className="text-xs md:text-sm text-blue-light flex flex-col justify-end items-end ml-1 mb-1">
                  WMatic
                </div>
              </div>
            </div>
            <div className="">
              <div className="text-sm md:text-sm text-blue-light">
                Deposited
              </div>
              <div className="flex flex-row">
                <div className="text-base md:text-3xl mt-1 w-1/3">
                  <Skeleton height={36} width={`100%`} animation="wave" />
                </div>
                <div className="text-xs md:text-sm text-blue-light flex flex-col justify-end items-end ml-1 mb-1">
                  WMatic
                </div>
              </div>
            </div>
            <div className="">
              <div className="text-sm md:text-sm text-blue-light">
                Bounties Completed
              </div>
              <Skeleton height={36} width={`50%`} animation="wave" />
            </div>
            <div className="">
              <div className="text-sm md:text-sm text-blue-light">
                Success Rate
              </div>
              <div className="flex flex-row">
                <div className="text-base md:text-3xl mt-1 w-1/3">
                  <Skeleton height={36} width={`100%`} />
                </div>
                <div className="text-xs md:text-sm text-blue-light flex flex-col justify-end items-end ml-1 mb-1">
                  %
                </div>
              </div>
            </div>
            <div className=" ">
              <div className="text-sm md:text-sm text-blue-light">
                Last Proposal
              </div>
              <div className="flex flex-row">
                <div className="text-base md:text-3xl mt-1 w-1/2">
                  <Skeleton height={36} width={`100%`} animation="wave" />
                </div>
                <div className="text-xs md:text-sm text-blue-light flex flex-col justify-end items-end ml-1 mb-1"></div>
              </div>
            </div>
            <div className="hidden lg:flex"></div>
            <div className="">
              <div className="text-sm text-left md:text-sm lg:text-right text-blue-light">
                Joined On
              </div>
              <div className="text-base md:text-xl mt-1 lg:text-right font-bold">
                <Skeleton height={36} width={`100%`} animation="wave" />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-4/5">
            <div className="flex flex-col w">
              <div className="mt-2">
                <Skeleton height={36} width={`50%`} animation="wave" />
              </div>
              <div className="text-base mt-4 flex flex-col">
                <Skeleton height={24} width={`50%`} animation="wave" />
                <Skeleton height={24} width={`75%`} animation="wave" />
                <Skeleton height={24} width={`60%`} animation="wave" />
              </div>
            </div>
          </div>
        </div>
        <div className="my-16 w-1/3">
          <Skeleton height={36} width={`40%`} animation="wave" />
        </div>
      </div>
    </Grow>
  );
};

export default ProfileSkeleton;
