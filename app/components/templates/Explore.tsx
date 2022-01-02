import { useExplore } from "pages";
import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import ExploreFilter from "../modules/filter/ExploreFilter";
import GigSummary from "../modules/gigSummary/gigSummary";
import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import SortButton from "../elements/sortButton";
import { sort } from "app/utils/utils";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching, gigs } = useExplore();
  const [sortBy, setSortBy] = useState("reward");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (gigs) {
      sort(sortBy, sortOrder, gigs);
    }
  }, [gigs]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
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
          />
          <SortButton
            text={"Deadline"}
            name={"deadline"}
            sortOrder={sortOrder}
            currentSort={sortBy === "deadline"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
          <SortButton
            text={"Collateral Required"}
            name={"minStake"}
            sortOrder={sortOrder}
            currentSort={sortBy === "minStake"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
        </div>

        {isFetching ? (
          <SummarySkeleton isFetching={isFetching} />
        ) : (
          // <motion.ul variants={container} initial="hidden" animate="show">
          //   {gigs?.map((val, idx) => (
          //     <motion.li key={idx} variants={item}>
          //       <GigSummary gig={val} />
          //     </motion.li>
          //   ))}
          // </motion.ul>
          <Reorder.Group
            axis="y"
            values={gigs as any}
            layoutScroll
            onReorder={() => console.log("reoirder")}
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
