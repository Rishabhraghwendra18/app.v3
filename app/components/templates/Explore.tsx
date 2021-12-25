import { useExplore } from "pages";
import ExploreFilter from "../modules/filter/ExploreFilter";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  const { isFetching, gigs } = useExplore();
  return (
    <div className="grid gap-1 grid-cols-6 mt-2 md:mt-8">
      <ExploreFilter />
      {isFetching ? <div>Fetching</div> : <div>loaded gigs</div>}
      {gigs?.map((val, idx) => {
        return (
          <li key={idx}>
            {val.name} {val.tags}
          </li>
        );
      })}
    </div>
  );
};

export default Explore;
