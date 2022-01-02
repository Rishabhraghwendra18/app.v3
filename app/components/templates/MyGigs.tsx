import SummarySkeleton from "../elements/skeleton/summarySkeleton";
import GigSummary from "../modules/gigSummary/gigSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useMyGigs } from "pages/myGigs";
import MyGigsFilter from "../modules/filter/MyGigsFilter";

interface Props {}

const MyGigsTemplate: React.FC<Props> = (props: Props) => {
  const { isFetching, myGigs } = useMyGigs();

  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <MyGigsFilter />
      <div className="col-span-5 flex flex-col pr-4">
        <div className="grid grid-cols-7 text-sm text-blue-light mb-1">
          <div className="col-span-4"></div>
          <button className="flex flex-row ml-1 hover:text-blue-bright transform transition-color duration-500 ease-in-out">
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
          myGigs?.map((val, idx) => {
            return <GigSummary gig={val} key={idx} />;
          })
        )}
      </div>
    </div>
  );
};

export default MyGigsTemplate;
