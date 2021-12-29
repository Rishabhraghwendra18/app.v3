import { statusIdToStatusMap } from "app/constants/constants";
import { filterByDate } from "app/utils/utils";
import { useRouter } from "next/router";
import { useExplore } from "pages";
import { useMyGigs } from "pages/myGigs";
import React from "react";

interface Props {
  checked: boolean;
  text: string;
  setOptionSelected: Function;
  groupName: string;
  option: number;
  minFilter?: number;
  maxFilter?: number;
}
const OptionFilter: React.FC<Props> = ({
  checked,
  groupName,
  setOptionSelected,
  option,
  text,
  minFilter,
  maxFilter,
}) => {
  const {
    filterGigs,
    setGigs,
    skills,
    minDeadline,
    maxDeadline,
    minCollateral,
    maxCollateral,
    setMinCollateral,
    setMaxCollateral,
    setMinDeadline,
    setMaxDeadline,
  } = useExplore();

  // const { filterMyGigs, setMyGigs } = useMyGigs();
  const router = useRouter();

  return (
    <div className="ml-8 mr-8 flex flex-row">
      <label className="text-sm inline-flex items-center mt-2">
        <input
          type="radio"
          name={groupName}
          checked={checked}
          onChange={async () => {
            setOptionSelected(option);
            switch (groupName) {
              case "collateral":
                setMinCollateral && setMinCollateral(minFilter);
                setMaxCollateral && setMaxCollateral(maxFilter);
                filterGigs &&
                  filterGigs({
                    onSuccess: (res) => {
                      setGigs &&
                        setGigs(filterByDate(res, [minDeadline, maxDeadline]));
                    },
                    params: {
                      tags: skills,
                      lockedStake: [minFilter, maxFilter],
                      sortBy: "reward",
                      sortOrder: "asc",
                    },
                  });
                break;
              case "deadline":
                setMinDeadline && (await setMinDeadline(minFilter));
                setMaxDeadline && (await setMaxDeadline(maxFilter));
                filterGigs &&
                  filterGigs({
                    onSuccess: (res) => {
                      setGigs &&
                        setGigs(filterByDate(res, [minFilter, maxFilter]));
                    },
                    params: {
                      tags: [],
                      lockedStake: [minCollateral, maxCollateral],
                      sortBy: "reward",
                      sortOrder: "asc",
                    },
                  });
                break;
              case "status":
                router.push({
                  search: `?status=${statusIdToStatusMap[option]}`,
                });
                break;
            }
          }}
        />
        <span className="ml-2">{text}</span>
      </label>
    </div>
  );
};

export default OptionFilter;
