import React, { Dispatch, SetStateAction } from "react";
import { sort } from "app/utils/utils";
import { useExplore } from "pages";
import { Button } from "@mui/material";
import ArrowIcon from "./arrowIcon";

interface Props {
  text: string;
  name: string;
  sortOrder: string;
  currentSort: boolean;
  setSortBy: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<string>>;
}

const SortButton = ({
  text,
  name,
  sortOrder,
  currentSort,
  setSortBy,
  setSortOrder,
}: Props) => {
  const { gigs } = useExplore();
  return (
    <div>
      <Button
        sx={{
          textTransform: "none",
          color: `${currentSort ? "#0061ff" : "#99ccff"}`,
        }}
        onClick={() => {
          const newSortOrder = currentSort
            ? sortOrder === "asc"
              ? "desc"
              : "asc"
            : "desc";
          setSortBy(name);
          sort(name, newSortOrder, gigs);
          setSortOrder(newSortOrder);
        }}
      >
        {text}
        <ArrowIcon state={sortOrder === "desc"} visible={currentSort} />
      </Button>
    </div>
  );
};

export default SortButton;
