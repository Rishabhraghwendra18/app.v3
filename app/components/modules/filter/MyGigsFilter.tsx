import OptionFilter from "app/components/elements/filters/OptionFilter";
import TextFilter from "app/components/elements/filters/TextFilter";
import { statusToStatusIdMap } from "app/constants/constants";
import { useRouter } from "next/router";
import { useMyGigs } from "pages/myGigs";
import { useEffect, useState } from "react";

interface Props {}

const MyGigsFilter: React.FC<Props> = (props: Props) => {
  const [status, setStatus] = useState(100);
  const router = useRouter();
  const statusParam = router.query.status as string;
  const { filterMyGigs, setMyGigs, setLoaded } = useMyGigs();
  useEffect(() => {
    if (statusParam) {
      setStatus(statusToStatusIdMap[statusParam]);
      setLoaded(false);
      filterMyGigs({
        onSuccess: (res) => {
          setMyGigs(res);
          setLoaded(true);
        },
        params: {
          sortBy: "reward",
          sortOrder: "asc",
          status: statusToStatusIdMap[statusParam],
        },
      });
    }
  }, [statusParam]);
  return (
    <div>
      <div>
        <div className="m-8 mb-2 flex flex-row">
          <span className="font-semibold text-sm text-blue-light">Status</span>
        </div>
        <OptionFilter
          checked={status === 100}
          option={100}
          setOptionSelected={setStatus}
          text={"Show All"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 101}
          option={101}
          setOptionSelected={setStatus}
          text={"Not Started"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 201}
          option={201}
          setOptionSelected={setStatus}
          text={"In Progress"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 202}
          option={202}
          setOptionSelected={setStatus}
          text={"In Review"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 203}
          option={203}
          setOptionSelected={setStatus}
          text={"Completed"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 402}
          option={402}
          setOptionSelected={setStatus}
          text={"Violations"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 403}
          option={403}
          setOptionSelected={setStatus}
          text={"Disputed"}
          groupName="status"
        />
        <OptionFilter
          checked={status === 401}
          option={401}
          setOptionSelected={setStatus}
          text={"Delisted"}
          groupName="status"
        />
      </div>
    </div>
  );
};

export default MyGigsFilter;
