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

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const GigTemplate = (props: Props) => {
  const { fetching, gig, tab } = useGig();

  return (
    <div className="p-8 mx-12">
      {fetching ? <GigHeadingSkeleton /> : <GigHeading />}
      <AnimatePresence exitBeforeEnter initial={false}>
        {fetching ? (
          <ClientBriefSkeleton key={-1} />
        ) : (
          tab === 0 && <ClientBrief key={0} />
        )}
        {tab === 1 && !fetching && <ViewProposals key={1} />}
        {tab === 2 && !fetching && <ProposalForm key={2} />}
        {tab === 3 && !fetching && gig.proposal?.length && (
          <SingleProposal key={3} />
        )}
        {tab === 4 && !fetching && gig.proposal?.length && (
          <SingleProposal key={4} />
        )}
        {tab === 5 && !fetching && <Submission key={5} />}
      </AnimatePresence>
    </div>
  );
};

export default GigTemplate;
