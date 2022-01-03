import React, { Dispatch, SetStateAction, useEffect } from "react";
import { sort } from "app/utils/utils";
import { Button } from "@mui/material";
import ArrowIcon from "./arrowIcon";
import { Gig, Proposal } from "app/types";

interface Props {
  text: string;
  name: string;
  sortOrder: string;
  currentSort: boolean;
  setSortBy: Dispatch<SetStateAction<string>>;
  setSortOrder: Dispatch<SetStateAction<string>>;
  array: Gig[] | Proposal[];
  setArray: Function;
}

const SortButton = ({
  text,
  name,
  sortOrder,
  currentSort,
  setSortBy,
  setSortOrder,
  array,
  setArray,
}: Props) => {
  useEffect(() => {
    console.log(`Name: ${name} currentSort: ${currentSort}`);
  }, []);

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
          setArray(sort(name, newSortOrder, array));
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
