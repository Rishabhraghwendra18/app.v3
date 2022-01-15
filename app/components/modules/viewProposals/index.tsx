import { Paper, styled, Typography } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React, { useEffect, useState } from "react";
import Proposal from "./proposal";
import ProposalCard from "./proposalCard";
import { motion } from "framer-motion";
import { animationVariant } from "app/constants/constants";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useRouter } from "next/router";

interface Props {}

const ViewProposals = (props: Props) => {
  const [selected, setSelected] = useState(0);
  const { proposals } = useGig();

  const router = useRouter();

  useEffect(() => {
    if (router.query?.proposal) {
      const index = proposals
        .map((e) => e.objectId)
        .indexOf(router.query.proposal as string);
      setSelected(index);
      document.getElementById(`proposal${index}`)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div>
        <div className="grid grid-cols-3">
          <div
            className="overflow-y-auto flex-auto h-screen"
            style={{ maxHeight: "30rem" }}
          >
            {proposals.map((val, idx) => (
              <div id={`proposal${idx}`} key={idx}>
                <ProposalCard
                  proposal={val}
                  isSelected={selected === idx}
                  setSelected={setSelected}
                  index={idx}
                  key={idx}
                />
              </div>
            ))}

            {!proposals.length && (
              <Typography sx={{ p: 1 }}>
                No proposals received yet! <SentimentDissatisfiedIcon />
              </Typography>
            )}
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
    </motion.main>
  );
};

export default ViewProposals;
