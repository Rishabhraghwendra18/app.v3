import { filterByDate } from "app/utils/utils";

import { useExplore } from "pages";
import React from "react";
import { exploreHelperTexts, skillOptions } from "app/constants/constants";
import { LightTooltip } from "../styledComponents";
import { Autocomplete, TextField } from "@mui/material";

interface Props {
  label: string;
}
const TextFilter: React.FC<Props> = ({ label }: Props) => {
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
    <div className="flex flex-row w-full">
      <div className="mx-8 text-sm w-2/3">
        <LightTooltip
          arrow
          placement="top"
          title={exploreHelperTexts["skills"]}
        >
          <Autocomplete
            multiple
            id="tags-standard"
            options={skillOptions}
            getOptionLabel={(option) => option.label}
            onChange={(evt, filters) => {
              let filterValues: string[] = [];
              for (let filter of filters) {
                filterValues.push(filter.label);
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
            renderInput={(params) => (
              <TextField {...params} variant="standard" label={label} />
            )}
          />
        </LightTooltip>
      </div>
    </div>
  );
};

export default TextFilter;
