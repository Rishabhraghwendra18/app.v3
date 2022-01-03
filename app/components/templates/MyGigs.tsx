import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import GigSummary from "../modules/gigSummary/gigSummary";
import { useMyGigs } from "pages/myGigs";
import MyGigsFilter from "../modules/filter/MyGigsFilter";
import SortButton from "../elements/sortButton";
import { useEffect, useState } from "react";
import { sort } from "app/utils/utils";
import { Gig } from "app/types";
import { Reorder } from "framer-motion";

interface Props {}

const MyGigsTemplate: React.FC<Props> = (props: Props) => {
  const { isFetching, myGigs, loaded, setMyGigs } = useMyGigs();
  const [sortBy, setSortBy] = useState("reward");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (loaded) {
      setMyGigs(sort(sortBy, sortOrder, myGigs));
    }
  }, [loaded]);

  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <MyGigsFilter />
      <div className="col-span-5 flex flex-col pr-4">
        <div className="grid grid-cols-7 text-sm text-blue-light mb-1">
          <div className="col-span-4"></div>
          <SortButton
            text={"Reward"}
            name={"reward"}
            sortOrder={sortOrder}
            currentSort={sortBy === "reward"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={myGigs as Gig[]}
            setArray={setMyGigs}
          />
          <SortButton
            text={"Deadline"}
            name={"deadline"}
            sortOrder={sortOrder}
            currentSort={sortBy === "deadline"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={myGigs as Gig[]}
            setArray={setMyGigs}
          />
          <SortButton
            text={"Collateral Required"}
            name={"minStake"}
            sortOrder={sortOrder}
            currentSort={sortBy === "minStake"}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            array={myGigs as Gig[]}
            setArray={setMyGigs}
          />
        </div>

        {isFetching ? (
          <SummarySkeleton isFetching={isFetching} />
        ) : (
          <Reorder.Group
            axis="y"
            values={myGigs as any}
            layoutScroll
            onReorder={() => console.log("reoirder")}
          >
            {myGigs?.map((item) => (
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

export default MyGigsTemplate;
