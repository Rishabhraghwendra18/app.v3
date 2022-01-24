import { useGig } from "pages/gig/[id]";
import ClientBrief from "../modules/clientBrief";
import ClientBriefSkeleton from "../modules/clientBrief/skeleton";
import { GigHeading } from "../modules/gigHeading";
import GigHeadingSkeleton from "../modules/gigHeading/skeleton";
import { ProposalForm } from "../modules/proposalForm";
import SingleProposal from "../modules/singleProposal";
import ViewProposals from "../modules/viewProposals";
import { AnimatePresence } from "framer-motion";
import Submission from "../modules/submission";
import dynamic from "next/dynamic";
import Dispute from "../modules/dispute";

interface Props {}

const GigTemplate = (props: Props) => {
  const { fetching, gig, tab, evidence } = useGig();

  return (
    <div className="p-8 mx-12">
      {fetching ? <GigHeadingSkeleton /> : <GigHeading />}
      <AnimatePresence exitBeforeEnter initial={false}>
        {fetching ? (
          <ClientBriefSkeleton key={-1} />
        ) : (
          tab === 0 && <ClientBrief key={0} />
        )}
        {tab === 1 && !fetching && gig && <ViewProposals key={1} />}
        {tab === 2 && !fetching && <ProposalForm key={2} />}
        {tab === 3 && !fetching && gig && gig.proposal?.length && (
          <SingleProposal key={3} />
        )}
        {tab === 4 && !fetching && gig && gig.proposal?.length && (
          <SingleProposal key={4} />
        )}
        {tab === 5 && !fetching && gig && <Submission key={5} />}
        {tab === 6 && !fetching && gig && <Dispute key={6} />}
      </AnimatePresence>
    </div>
  );
};

export default GigTemplate;
