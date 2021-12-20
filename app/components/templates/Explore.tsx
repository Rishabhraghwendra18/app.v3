import { useExplore } from "pages";
import ExploreFilter from "../modules/filter/ExploreFilter";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";

interface Props {}

const Explore: React.FC<Props> = (props: Props) => {
  // const { register, handleSubmit, watch, setValue } = useForm();
  // useFormPersist(
  //   "foo",
  //   { watch, setValue },
  //   {
  //     storage: window.localStorage, // default window.sessionStorage
  //     exclude: ["foo"],
  //   }
  // );
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
