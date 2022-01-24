import { Grow, Skeleton } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React from "react";

interface Props {}

const ClientBriefSkeleton = (props: Props) => {
  const { fetching } = useGig();

  return (
    <Grow in={fetching} timeout={1000}>
      <div className="w-full">
        <div className="w-full mt-2">
          <Skeleton height={64} width={`50%`} />
        </div>
        <div className="flex flex-row w-full">
          <div className="grid grid-cols-6 w-full">
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Gig Reward</div>
              <div className="flex flex-row items-baseline">
                <Skeleton height={32} width={50} animation="wave" />
                <div className="text-sm text-grey-normal ml-1 mb-1 ">
                  WMatic
                </div>
              </div>
              <div className="flex flex-row  mt-1 text-sm">
                <Skeleton height={20} width={40} animation="wave" />
                <div className="mx-1 text-grey-normal">USD</div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Submission Deadline</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold">
                  <Skeleton height={32} width={120} animation="wave" />
                </div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Collateral Required</div>
              <div className="flex flex-row items-baseline">
                <Skeleton height={32} width={50} animation="wave" />
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  WMatic
                </div>
              </div>
              <div className="flex flex-row  items-baseline mt-1 text-sm">
                <Skeleton height={20} width={40} animation="wave" />
                <div className="mx-1 text-grey-normal">USD</div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Days to Accept Work</div>
              <div className="flex flex-row items-baseline">
                <Skeleton height={32} width={50} animation="wave" />
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  Days
                </div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Revisions</div>
              <div className="flex flex-row">
                <Skeleton height={32} width={120} animation="wave" />
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Time to Revise</div>
              <div className="flex flex-row">
                <Skeleton height={32} width={120} animation="wave" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row mb-16">
          <div className="w-1/2">
            <span className="text-blue-bright font-bold w-1/2">
              About the Gig
            </span>
            <div className="flex flex-col mt-4">
              <Skeleton height={30} width={`50%`} animation="wave" />
              <Skeleton height={30} width={`75%`} animation="wave" />
              <Skeleton height={30} width={`60%`} animation="wave" />
              <Skeleton height={30} width={`40%`} animation="wave" />
            </div>
          </div>
        </div>
        <Skeleton height={36} width={`15%`} animation="wave" />
      </div>
    </Grow>
  );
};

export default ClientBriefSkeleton;
