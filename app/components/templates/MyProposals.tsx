import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import MyProposalsFilter from "../modules/filter/MyProposalsFilter";
import ProposalSummary from "../modules/proposalSummary";
import { useMyProposals } from "pages/myProposals";
import SortButton from "../elements/sortButton";
import { useEffect, useState } from "react";
import { sort } from "app/utils/utils";
import { Proposal } from "app/types";
import { Reorder } from "framer-motion";

interface Props {}

const MyProposalsTemplate: React.FC<Props> = (props: Props) => {
  const { isFetching, myProposals, setMyProposals, loaded } = useMyProposals();
  const [sortBy, setSortBy] = useState("lockedStake");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (loaded) {
      setMyProposals(sort(sortBy, sortOrder, myProposals));
    }
  }, [loaded]);
  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <MyProposalsFilter />
      <div className="col-span-5 flex flex-col pr-4">
        <div className="grid grid-cols-7 text-sm text-blue-light mb-1">
          <div className="col-span-4"></div>
          <div></div>
          <SortButton
            text={"Deadline"}
            name={"deadline"}
            sortOrder={sortOrder}
            currentSort={sortBy === "deadline"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={myProposals as Proposal[]}
            setArray={setMyProposals}
          />
          <SortButton
            text={"Collateral Required"}
            name={"lockedStake"}
            sortOrder={sortOrder}
            currentSort={sortBy === "lockedStake"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={myProposals as Proposal[]}
            setArray={setMyProposals}
          />
        </div>

        {!loaded ? (
          <SummarySkeleton isFetching={isFetching} />
        ) : (
          <Reorder.Group
            axis="y"
            values={myProposals as any}
            layoutScroll
            onReorder={() => console.log("reoirder")}
          >
            {myProposals?.map((item) => (
              <Reorder.Item
                key={item.dealId}
                value={item}
                transition={{ duration: 1 }}
              >
                <ProposalSummary proposal={item} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};

export default MyProposalsTemplate;
