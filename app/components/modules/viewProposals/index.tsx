import { Paper, styled } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React, { useEffect, useState } from "react";
import Proposal from "./proposal";
import ProposalCard from "./proposalCard";

interface Props {}

const ViewProposals = (props: Props) => {
  const [selected, setSelected] = useState(0);
  const { proposals } = useGig();

  return (
    <div>
      <div className="grid grid-cols-3">
        <div
          className="overflow-y-auto flex-auto h-screen"
          style={{ maxHeight: "30rem" }}
        >
          {proposals.map((val, idx) => (
            <ProposalCard
              proposal={val}
              isSelected={selected === idx}
              setSelected={setSelected}
              index={idx}
              key={idx}
            />
          ))}
        </div>
        <div className="col-span-2 border-l-1 border-grey-normal">
          {proposals.length > 0 && selected >= 0 ? (
            <Proposal proposal={proposals[selected]} />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProposals;
