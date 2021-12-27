import { Grow, Skeleton } from "@mui/material";
import { useGig } from "pages/gig/[id]";
import React from "react";

interface Props {}

const GigHeadingSkeleton = (props: Props) => {
  const { fetching } = useGig();

  return (
    <Grow in={fetching} timeout={1000}>
      <div className="grid gap-1 grid-cols-5 md:grid-cols-7 mt-4">
        <div className="col-span-3 md:col-span-4 flex flex-row">
          <div className="hidden md:flex mr-8">
            <Skeleton variant="circular" height={95} width={95} />
          </div>
          <div className="flex flex-col" style={{ width: "100%" }}>
            <Skeleton
              variant="text"
              height={40}
              width={`70%`}
              animation="wave"
            />
            <Skeleton
              variant="text"
              height={12}
              width={`20%`}
              animation="wave"
            />
            <Skeleton
              variant="text"
              height={24}
              width={`55%`}
              animation="wave"
            />
          </div>
        </div>
      </div>
    </Grow>
  );
};

export default GigHeadingSkeleton;
