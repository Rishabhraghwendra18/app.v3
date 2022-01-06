import { Collapse, Fade, Grow } from "@mui/material";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import {
  animationVariant,
  gigStatusMapping,
  monthMap,
} from "app/constants/constants";
import { useGlobal } from "app/context/globalContext";
import { formatTime, formatTimeLeft } from "app/utils/utils";
import { useGig } from "pages/gig/[id]";
import React, { useEffect, useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import AssignmentIcon from "@mui/icons-material/Assignment";
import dynamic from "next/dynamic";

interface Props {}

const ClientBrief = (props: Props) => {
  const { gig, fetching, setTab } = useGig();
  const {
    state: { conversionRate, userInfo },
  } = useGlobal();

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  if (!gig) {
    return <div></div>;
  } else {
    return (
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={animationVariant}
      >
        <div className="">
          <div className="flex flex-row">
            <div className="grid grid-cols-5 w-3/4">
              <div className="flex flex-col my-8">
                <div className="text-sm text-grey- dark:text-blue-light">
                  Gig Reward
                </div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold ">
                    {gig.reward?.toFixed(2)}
                  </div>
                  <div className="text-sm text-grey-normal ml-1 mb-1 ">
                    WMatic
                  </div>
                </div>
                <div className="flex flex-row text-grey-normal mt-1 text-sm">
                  <div className="">
                    {(gig.reward * (conversionRate || 0)).toFixed(2)}
                  </div>
                  <div className="mx-1">USD</div>
                </div>
              </div>
              <div className="flex flex-col my-8">
                <div className="text-sm text-grey-normal dark:text-blue-light">
                  Submission Deadline
                </div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold ">
                    {gig.deadline.getDate()}
                  </div>
                  <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                    {monthMap[gig.deadline.getMonth()]}{" "}
                    {gig.deadline.getFullYear()}
                  </div>
                  <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                    {formatTime(gig.deadline)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col my-8">
                <div className="text-sm text-grey- text-blue-light">
                  Collateral Required
                </div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold ">
                    {gig.minStake.toFixed(2)}
                  </div>
                  <div className="text-sm text-grey-normal flex flex-col justify-end items-end ml-1 mb-1">
                    WMatic
                  </div>
                </div>
                <div className="flex flex-row text-grey-normal items-baseline mt-1 text-sm">
                  <div className="">
                    {(gig.minStake * (conversionRate || 0)).toFixed(2)}
                  </div>
                  <div className="mx-1">USD</div>
                </div>
              </div>
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">
                  Days to Accept Work
                </div>
                <div className="flex flex-row items-baseline">
                  <div className="text-xl mt-1 font-bold ">
                    {gig.timeToAcceptInDays}
                  </div>
                </div>
              </div>
              <div className="flex flex-col my-8">
                <div className="text-sm text-blue-light">Gig Status</div>
                <div className="flex flex-row">
                  <div className="text-lg font-bold ">
                    {gigStatusMapping[gig.status]}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row mb-16">
            <div className="w-2/3">
              <span className="text-blue-bright font-bold w-1/2">
                About the Gig
              </span>
              <div className="py-2">
                <ReactQuill
                  value={(gig?.description || "") as any}
                  readOnly={true}
                  theme={"bubble"}
                />
              </div>
            </div>
          </div>
          <div>
            {[101].includes(gig.status) &&
              gig.clientUsername === userInfo?.get("spectUsername") && (
                <div className="w-1/4">
                  <PrimaryButton
                    variant="outlined"
                    size="large"
                    fullWidth
                    endIcon={<DeleteIcon />}
                  >
                    Delete Gig
                  </PrimaryButton>
                </div>
              )}
            {[101].includes(gig.status) &&
              gig.clientUsername !== userInfo?.get("spectUsername") &&
              !gig.proposal.length && (
                <div className="w-1/4">
                  <PrimaryButton
                    variant="outlined"
                    size="large"
                    fullWidth
                    endIcon={<AssignmentIcon />}
                    onClick={() => {
                      setTab(2);
                    }}
                  >
                    Submit Proposal
                  </PrimaryButton>
                </div>
              )}
          </div>
        </div>
      </motion.main>
    );
  }
};

export default ClientBrief;
