import { Grow } from "@mui/material";
import { useExplore } from "pages";
import ExploreFilter from "../modules/filter/ExploreFilter";
import GigSummary from "../modules/gigSummary/gigSummary";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching, gigs } = useExplore();
  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <ExploreFilter />
      {console.log(gigs)}
      <div className="col-span-5 flex flex-col pr-4">
        {isFetching ? <div>Fetching</div> : <div>loadedd gigs</div>}
        {gigs?.map((val, idx) => {
          return (
            <Grow
              in={!isFetching}
              key={idx}
              {...(!isFetching ? { timeout: 1000 } : {})}
            >
              <div>
                <GigSummary gig={val} />
              </div>
            </Grow>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
