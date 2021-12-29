import { Box, Grow, styled, Tab, Tabs } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React from "react";
import { useMoralis } from "react-moralis";
import ClientBrief from "../modules/clientBrief";
import ClientBriefSkeleton from "../modules/clientBrief/skeleton";
import { GigHeading } from "../modules/gigHeading";
import GigHeadingSkeleton from "../modules/gigHeading/skeleton";
import { ProposalForm } from "../modules/proposalForm";
import SingleProposal from "../modules/singleProposal";
import ViewProposals from "../modules/viewProposals";

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "1.2rem",
  marginRight: 25,
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const GigTemplate = (props: Props) => {
  const { fetching, gig, tab, setTab } = useGig();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="p-8 mx-12">
      {fetching ? <GigHeadingSkeleton /> : <GigHeading />}
      <TabPanel value={tab} index={0}>
        {fetching ? <ClientBriefSkeleton /> : <ClientBrief />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ViewProposals />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <ProposalForm />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        {gig.proposal?.length && <SingleProposal />}
      </TabPanel>
      <TabPanel value={tab} index={4}>
        {gig.proposal?.length && <SingleProposal />}
      </TabPanel>
    </div>
  );
};

export default GigTemplate;
