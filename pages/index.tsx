import { Layout } from "app/components/layouts";
import Explore from "app/components/templates/Explore";
import { Gig } from "app/types";
import { filterByDate } from "app/utils/utils";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useContext, useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";

type fetchResponse = {
  result: Array<Gig>;
};

interface Props {
  bounties: fetchResponse;
}

interface ExploreContextType {
  filterGigs?: Function;
  data: Array<Gig> | unknown;
  isFetching: boolean;
  minDeadline: number;
  setMinDeadline?: Function;
  maxDeadline: number;
  setMaxDeadline?: Function;
  minCollateral: number;
  setMinCollateral?: Function;
  maxCollateral: number;
  setMaxCollateral?: Function;
  gigs: Array<Gig> | undefined;
  setGigs?: Function;
  skills: Array<object>;
  setSkills?: Function;
}

export const ExploreContext = createContext<ExploreContextType>({
  data: undefined,
  gigs: undefined,
  isFetching: false,
  minDeadline: 0,
  maxDeadline: 365,
  minCollateral: 0,
  maxCollateral: Number.MAX_SAFE_INTEGER,
  skills: [],
});

const Home: NextPage<Props> = ({ bounties }) => {
  const value = useProvideExplore();
  const { isInitialized, Moralis, web3 } = useMoralis();
  useEffect(() => {
    if (isInitialized) {
      value.filterGigs({
        onSuccess: (res: Array<Gig>) => {
          console.log(res);
          value.setGigs(
            filterByDate(res, [value.minDeadline, value.maxDeadline])
          );
        },
        params: {
          tags: [],
          lockedStake: [value.minCollateral, value.maxCollateral],
          sortBy: "reward",
          sortOrder: "asc",
        },
      });
    }
  }, [isInitialized]);

  return (
    <div>
      <Head>
        <title>Spect.Network</title>
        <meta name="description" content="Decentralized gig economy" />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <Layout>
        <div className="grid gap-1 grid-cols-6 mt-4 md:mt-8">
          <div></div>
          <div className="flex flex-row col-span-5">
            <div className="flex flex-row w-5/6 items-center">
              <span className="text-base md:text-2xl lg:text-3xl text-blue-bright">
                Explore Gigs
              </span>
              <div className="flex flex-row ml-8 justify-center">
                <div className="text-base md:text-2xl lg:text-3xl mt-1 text-blue-light">
                  {" "}
                  {1}
                </div>
                <div className="hidden md:flex text-sm flex flex-col justify-end items-end ml-1 mb-1 text-blue-light">
                  Matching Gigs
                </div>
              </div>
            </div>
          </div>
        </div>
        <ExploreContext.Provider value={value}>
          <Explore />
        </ExploreContext.Provider>
      </Layout>
    </div>
  );
};

export function useProvideExplore() {
  const [minDeadline, setMinDeadline] = useState(0);
  const [maxDeadline, setMaxDeadline] = useState(365);
  const [minCollateral, setMinCollateral] = useState(0);
  const [maxCollateral, setMaxCollateral] = useState(Number.MAX_SAFE_INTEGER);
  const [skills, setSkills] = useState([]);
  const [gigs, setGigs] = useState<Gig[] | undefined>([]);
  const {
    fetch: filterGigs,
    data,
    error,
    isFetching,
  } = useMoralisCloudFunction(
    "filterBounties",
    {
      limit: 100,
    },
    { autoFetch: false }
  );

  return {
    filterGigs,
    data,
    isFetching,
    minDeadline,
    setMinDeadline,
    maxDeadline,
    setMaxDeadline,
    minCollateral,
    setMinCollateral,
    maxCollateral,
    setMaxCollateral,
    skills,
    setSkills,
    gigs,
    setGigs,
  };
}

export const useExplore = () => useContext(ExploreContext);

export default Home;
