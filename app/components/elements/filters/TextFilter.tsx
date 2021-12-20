import { filterByDate } from "app/utils/utils";
import Select from "react-select";

import { useExplore } from "pages";
import React from "react";
import { selectStyleDark, skillOptions } from "app/constants/constants";

interface Props {}
const TextFilter: React.FC<Props> = ({}) => {
  const {
    filterGigs,
    setGigs,
    setSkills,
    minDeadline,
    maxDeadline,
    minCollateral,
    maxCollateral,
  } = useExplore();
  return (
    <div className="flex flex-row">
      <Select
        isMulti
        autoFocus
        options={skillOptions}
        placeholder="Add Skills"
        classNamePrefix="select"
        styles={selectStyleDark}
        className="border-b ml-8 mr-8 mt-4 text-sm"
        onChange={(filters) => {
          let filterValues: string[] = [];
          for (let filter of filters) {
            filterValues.push(filter.value);
          }
          setSkills && setSkills(filterValues);
          filterGigs &&
            filterGigs({
              onSuccess: (res) => {
                setGigs &&
                  setGigs(filterByDate(res, [minDeadline, maxDeadline]));
              },
              params: {
                tags: filterValues,
                lockedStake: [minCollateral, maxCollateral],
                sortBy: "reward",
                sortOrder: "asc",
              },
            });
        }}
      />
    </div>
  );
};

export default TextFilter;
