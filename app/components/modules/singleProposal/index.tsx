import { Tooltip } from "@mui/material";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { monthMap, proposalStatusMapping } from "app/constants/constants";
import { useGlobal } from "app/context/web3Context";
import { formatTime, fromWei, getSuccessRate } from "app/utils/utils";
import Link from "next/link";
import { useGig } from "pages/gig/[id]";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import ReactQuill from "react-quill";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ConfirmModal } from "./confirmModal";

interface Props {}

const SingleProposal = (props: Props) => {
  const { gig, contractGig, fetching } = useGig();
  const {
    state: { conversionRate, userInfo },
  } = useGlobal();
  const { user } = useMoralis();
  const [deadline, setDeadline] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (gig.status === 102) {
      const date = new Date(gig.verifiableBounty?.get("deadline") * 1000);
      setDeadline(date);
    }
  }, []);

  if (fetching) {
    return <div>Fetching</div>;
  } else {
    return (
      <div className="">
        <ConfirmModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          proposal={gig.proposal[0]}
        />
        <div className="flex flex-row">
          <div className="grid grid-cols-7 w-full">
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Collateral</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold">
                  {gig.proposal[0].lockedStake.toFixed(2)}
                </div>
                <div className="text-sm text-grey-normal ml-1 mb-1">WMatic</div>
              </div>
              <div className="flex flex-row text-grey-normal mt-1 text-sm">
                <div className="">
                  {" "}
                  {(
                    gig.proposal[0].lockedStake * (conversionRate || 0)
                  ).toFixed(2)}
                </div>
                <div className="mx-1">USD</div>
              </div>
            </div>
            {gig.proposal[0].status === 103 && (
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">Reward</div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold">
                    {fromWei(contractGig.reward)}
                  </div>
                  <div className="text-sm text-grey-normal ml-1 mb-1">
                    WMatic
                  </div>
                </div>
                <div className="flex flex-row text-grey-normal mt-1 text-sm">
                  <div className="">
                    {" "}
                    {(
                      fromWei(contractGig.reward) * (conversionRate || 0)
                    ).toFixed(2)}
                  </div>
                  <div className="mx-1">USD</div>
                </div>
              </div>
            )}
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Proposed Deadline</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold"></div>
                <div className="text-sm flex flex-col justify-end items-end mb-1">
                  <div className="flex flex-row items-baseline">
                    <div className="text-xl mt-1 font-bold">
                      {deadline?.getDate() ||
                        gig.proposal[0]?.deadline.getDate()}
                    </div>
                    <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                      {deadline
                        ? monthMap[deadline.getMonth()]
                        : monthMap[gig.proposal[0].deadline.getMonth()]}{" "}
                      {deadline?.getFullYear() ||
                        gig.proposal[0].deadline.getFullYear()}
                    </div>
                    <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                      {formatTime(gig.proposal[0]?.deadline)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Completed Gigs</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold">
                  {gig.proposal[0]?.completedJobs}
                </div>
              </div>
            </div>
            <div className="flex flex-col my-8">
              <div className="text-sm text-blue-light">Success Rate</div>
              <div className="flex flex-row items-baseline">
                <div className="text-xl mt-1 font-bold">
                  {getSuccessRate(gig.proposal[0]).toFixed(0)}
                </div>
                <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                  %
                </div>
              </div>
            </div>
            {gig.proposal[0].status === 103 && (
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">Revisions</div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold">
                    {gig.verifiableBounty?.get("numRevisionsRemaining")}
                  </div>
                </div>
              </div>
            )}
            {gig.proposal[0].freelancer === user?.get("Username") && (
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">Proposal Status</div>
                <div className="flex flex-row">
                  <div className="text-xl font-bold">
                    {proposalStatusMapping[gig.proposal[0].status]}
                  </div>
                </div>
              </div>
            )}
            {gig.proposal[0].freelancer !== user?.get("Username") && (
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">Created by</div>
                <div className="text-lg flex flex-row">
                  <span className="font-bold">
                    {gig.proposal[0]?.freelancer}
                  </span>
                  <Link
                    href={`/profile/${gig.proposal[0].freelancer}`}
                    passHref
                  >
                    <Tooltip title="Go to profile">
                      <i className="fas fa-external-link-alt mx-2 text-grey-normal mt-1"></i>
                    </Tooltip>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row mb-8">
          <div className="w-2/3">
            <span className="text-blue-bright font-bold w-1/2">
              {gig.proposal[0].title}
            </span>
            <div className="">
              <ReactQuill
                value={gig.proposal[0].proposalText as any}
                readOnly={true}
                theme={"bubble"}
              />
            </div>
          </div>
        </div>
        {userInfo?.get("spectUsername") === gig.proposal[0].freelancer &&
          gig.status === 102 &&
          gig.proposal[0].status === 103 && (
            <div className="w-1/3">
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
                Confirm and Start Work
              </PrimaryButton>
            </div>
          )}
      </div>
    );
  }
};

export default SingleProposal;
