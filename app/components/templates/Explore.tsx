import { useExplore } from "pages";
import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import ExploreFilter from "../modules/filter/ExploreFilter";
import GigSummary from "../modules/gigSummary/gigSummary";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import SortButton from "../elements/sortButton";
import { sort } from "app/utils/utils";
import { Gig } from "app/types";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching, gigs, setGigs, loaded } = useExplore();
  const [sortBy, setSortBy] = useState("reward");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (loaded) {
      setGigs(sort(sortBy, sortOrder, gigs));
    }
  }, [loaded]);

  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <ExploreFilter />
      <div className="col-span-5 flex flex-col pr-4">
        <div className="grid grid-cols-7 text-sm text-blue-light mb-1 mr-3">
          <div className="col-span-4"></div>
          <SortButton
            text={"Reward"}
            name={"reward"}
            sortOrder={sortOrder}
            currentSort={sortBy === "reward"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={gigs as Gig[]}
            setArray={setGigs}
          />
          <SortButton
            text={"Deadline"}
            name={"deadline"}
            sortOrder={sortOrder}
            currentSort={sortBy === "deadline"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={gigs as Gig[]}
            setArray={setGigs}
          />
          <SortButton
            text={"Collateral Required"}
            name={"minStake"}
            sortOrder={sortOrder}
            currentSort={sortBy === "minStake"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={gigs as Gig[]}
            setArray={setGigs}
          />
        </div>

        {isFetching ? (
          <SummarySkeleton isFetching={isFetching} />
        ) : (
          <Reorder.Group
            axis="y"
            values={gigs as any}
            layoutScroll
            onReorder={() => console.log("reorder")}
          >
            {gigs?.map((item) => (
              <Reorder.Item
                key={item.dealId}
                value={item}
                transition={{ duration: 1 }}
              >
                <GigSummary gig={item} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};

export default Explore;
