import { Button, Tooltip } from "@mui/material";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { monthMap } from "app/constants/constants";
import { useGlobal } from "app/context/web3Context";
import { Proposal } from "app/types";
import { formatTime, getSuccessRate } from "app/utils/utils";
import Link from "next/link";
import React, { useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneIcon from "@mui/icons-material/Done";
import { ConfirmModal } from "./confirmModal";
import dynamic from "next/dynamic";

interface Props {
  proposal: Proposal;
}

const Proposal = ({ proposal }: Props) => {
  const {
    state: { conversionRate },
  } = useGlobal();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          proposal={proposal}
        />
      )}
      <div className="">
        <div className="flex flex-row mb-4">
          <div className="grid grid-cols-5 w-full">
            <div className="flex flex-col">
              <div className="text-sm text-blue-light">Proposed deadline</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold ">
                  {proposal.deadline?.getDate()}
                </div>
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  {monthMap[proposal.deadline?.getMonth()]}{" "}
                  {proposal.deadline?.getFullYear()}
                </div>
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  {formatTime(proposal?.deadline)}
                </div>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="text-sm text-blue-light">Collateral</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold">
                  {proposal.lockedStake?.toFixed(2)}
                </div>
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  WMatic
                </div>
              </div>
              <div className="flex flex-row text-grey-normal items-baseline mt-1 text-sm">
                <div className="">
                  {(proposal.lockedStake * (conversionRate || 0)).toFixed(2)}
                </div>
                <div className="mx-1">USD</div>
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="text-sm text-blue-light">Completed Gigs</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl font-bold ">
                  {proposal.completedJobs}
                </div>
                {proposal.completedJobs !== 1 && (
                  <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                    Gigs
                  </div>
                )}
                {proposal.completedJobs === 1 && (
                  <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                    Gig
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="text-sm text-blue-light">Success Rate</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl font-bold">
                  {getSuccessRate(proposal)?.toFixed(0)}
                </div>
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  %
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-blue-light">Created by</div>
              <div className="text-lg flex flex-row">
                <span className="font-bold ">{proposal?.freelancer}</span>
                <a
                  href={`/profile/${proposal?.freelancer}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Tooltip title="Go to profile">
                    <i className="fas fa-external-link-alt mx-2 text-grey-normal mt-1"></i>
                  </Tooltip>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row mb-4">
        <div className="">
          <span className="text-blue-bright font-bold w-1/2">
            {proposal.title}
          </span>
          <div className="py-4 ">
            <ReactQuill
              value={proposal.proposalText as any}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
        </div>
      </div>
      <div className="w-1/3 my-4">
        <PrimaryButton
          variant="outlined"
          size="large"
          fullWidth
          type="submit"
          endIcon={<CheckCircleIcon />}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Select Proposal
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Proposal;
