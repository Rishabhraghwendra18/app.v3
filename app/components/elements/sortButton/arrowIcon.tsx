import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

interface Props {
  state: boolean;
  visible: boolean;
}

const ArrowIcon = ({ state, visible }: Props) => {
  return (
    <div
      className={`${
        state ? "rotate-180" : "rotate-0"
      } transform transition ease-in-out duration-1000 ml-1`}
    >
      <ArrowDropUpIcon className={`${!visible && "hidden"}`} />
    </div>
  );
};

export default ArrowIcon;
