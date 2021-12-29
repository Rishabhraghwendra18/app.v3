import { styled, Tab } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React from "react";
import ClientBrief from "../modules/clientBrief";
import ClientBriefSkeleton from "../modules/clientBrief/skeleton";
import { GigHeading } from "../modules/gigHeading";
import GigHeadingSkeleton from "../modules/gigHeading/skeleton";
import { ProposalForm } from "../modules/proposalForm";
import SingleProposal from "../modules/singleProposal";
import ViewProposals from "../modules/viewProposals";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {children}
//     </div>
//   );
// }

const variants = {
  hidden: {
    opacity: 0,
    x: -100,
    y: 0,
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    x: 0,
    y: -100,
    transition: {
      duration: 0.5,
    },
  },
};

const GigTemplate = (props: Props) => {
  const { fetching, gig, tab, setTab } = useGig();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="p-8 mx-12">
      {fetching ? <GigHeadingSkeleton /> : <GigHeading />}
      <AnimatePresence
        exitBeforeEnter
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        {fetching ? (
          <ClientBriefSkeleton key={-1} />
        ) : (
          tab === 0 && <ClientBrief key={0} />
        )}
        {tab === 1 && <ViewProposals key={1} />}
        {tab === 2 && <ProposalForm key={2} />}
        {tab === 3 && gig.proposal?.length && <SingleProposal />}
        {tab === 4 && gig.proposal?.length && <SingleProposal />}
      </AnimatePresence>
    </div>
  );
};

export default GigTemplate;
