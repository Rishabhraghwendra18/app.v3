import { useExplore } from "pages";
import ExploreFilter from "../modules/filter/ExploreFilter";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching } = useExplore();
  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <ExploreFilter />
      {isFetching ? <div>Fetching</div> : <div>loaded gigs</div>}
    </div>
  );
};

export default Explore;
