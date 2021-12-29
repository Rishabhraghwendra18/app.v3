import { Grow, Skeleton } from "@mui/material";
import React from "react";

interface Props {
  isFetching: boolean;
}

const SummarySkeleton = ({ isFetching }: Props) => {
  return (
    <Grow in={isFetching} timeout={1000}>
      <section>
        {Array(5)
          .fill("")
          .map((item, index) => (
            <div
              className="grid gap-1 grid-cols-5 md:grid-cols-7 mt-2 border-1 border-blue-light px-4 py-2"
              style={{ borderRadius: "2rem" }}
              key={index}
            >
              <div className="col-span-3 md:col-span-4 flex flex-row">
                <div className="hidden md:flex w-1/6">
                  <Skeleton variant="circular" height={80} width={80} />
                </div>
                <div className="flex flex-col" style={{ width: "100%" }}>
                  <Skeleton
                    variant="text"
                    height={32}
                    width={`50%`}
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
                    width={`75%`}
                    animation="wave"
                  />
                </div>
              </div>
              <div className="flex flex-col" style={{ width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  height={36}
                  width={`50%`}
                  animation="wave"
                />
              </div>
              <div className="flex flex-col" style={{ width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  height={36}
                  width={`50%`}
                  animation="wave"
                />
              </div>
              <div className="flex flex-col" style={{ width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  height={36}
                  width={`50%`}
                  animation="wave"
                />
              </div>
            </div>
          ))}
      </section>
    </Grow>
  );
};

export default SummarySkeleton;
