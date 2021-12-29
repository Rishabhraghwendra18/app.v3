import { useExplore } from "pages";
import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import ExploreFilter from "../modules/filter/ExploreFilter";
import GigSummary from "../modules/gigSummary/gigSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import { Gig } from "app/types";
import { motion } from "framer-motion";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching, gigs } = useExplore();
  const [sortedGigs, setSortedGigs] = useState<Array<Gig>>();

  useEffect(() => {
    // if (gigs) {
    //   setSortedGigs(gigs);
    //   sort("reward", "desc");
    // }
  }, [sortedGigs]);

  function sort(sortCurrBy, sortCurrOrder) {
    if (sortedGigs) {
      if (sortCurrOrder === "desc") {
        return sortedGigs.sort((a, b) =>
          a[sortCurrBy] < b[sortCurrBy]
            ? 1
            : b[sortCurrBy] < a[sortCurrBy]
            ? -1
            : 0
        );
      } else if (sortCurrOrder === "asc") {
        return sortedGigs.sort((a, b) =>
          a[sortCurrBy] > b[sortCurrBy]
            ? 1
            : b[sortCurrBy] > a[sortCurrBy]
            ? -1
            : 0
        );
      }
    }
  }
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
        <div className="grid grid-cols-7 text-sm text-blue-light mb-1">
          <div className="col-span-4"></div>
          <button
            className="flex flex-row ml-1 hover:text-blue-bright transform transition-color duration-500 ease-in-out"
            onClick={() => {
              setSortedGigs(sort("reward", "desc"));
            }}
          >
            <span>Reward</span>
            <ArrowDropDownIcon />
          </button>
          <button className="flex flex-row ml-1 hover:text-blue-bright transform transition-color duration-500 ease-in-out">
            <span>Deadline</span>
            <ArrowDropDownIcon />
          </button>
          <button className="flex flex-row hover:text-blue-bright transform transition-color duration-500 ease-in-out">
            <span>Collateral Required</span>
            <ArrowDropDownIcon />
          </button>
        </div>

        {isFetching ? (
          <SummarySkeleton isFetching={isFetching} />
        ) : (
          <motion.ul variants={container} initial="hidden" animate="show">
            {gigs?.map((val, idx) => (
              <motion.li key={idx} variants={item}>
                <GigSummary gig={val} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default Explore;

/* gigs?.map((val, idx) => {
            return <GigSummary gig={val} key={idx} />;
          }) */
