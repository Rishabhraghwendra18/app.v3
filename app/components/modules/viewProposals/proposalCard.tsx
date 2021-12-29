import { Avatar, Button, Paper, styled } from "@mui/material";
import { monthMap } from "app/constants/constants";
import { Proposal } from "app/types";
import { getSuccessRate } from "app/utils/utils";
import React, { Attributes } from "react";

interface Props {
  proposal: Proposal;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

const ProposalSummaryButton = styled(Button)(({ theme }) => ({
  width: "100%",
  borderColor: "#99ccff",
  display: "flex",
  justifyContent: "flex-start",
  textTransform: "none",
}));

export const ProposalAvatar = styled(Avatar)(({ theme }) => ({
  width: "4rem",
  height: "4rem",
  objectFit: "cover",
}));

const ProposalCard = ({ proposal, isSelected, setSelected, index }: Props) => {
  return (
    <div
      className={`${
        isSelected && "bg-grey-bluish"
      } transform transition-color duration-1000`}
    >
      <ProposalSummaryButton
        onClick={() => {
          setSelected(index);
        }}
      >
        <div className="px-2 py-4 ml-2">
          <div className="flex flex-row">
            <ProposalAvatar
              alt="Username"
              src={proposal.user[0].profilePicture}
            />
            <div className="flex flex-col ml-4 mt-2">
              <div className="font-bold text-xl text-grey-light text-left">
                {proposal.freelancer}
              </div>
              <div className="text-xs text-gray-400 flex flex-row mr-8 mt-1">
                <div className="mr-4">
                  Active since{" "}
                  {monthMap[proposal?.user[0]?._created_at.getMonth()]}{" "}
                  {proposal?.user[0]?._created_at.getFullYear()}
                </div>
                <i className="fas fa-circle flex flex-col justify-center mr-1 text-green-400"></i>
                <div>
                  {getSuccessRate(proposal).toFixed(2) || " - "}% Completion
                  rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProposalSummaryButton>
    </div>
  );
};

export default ProposalCard;
