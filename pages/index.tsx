import { Button } from "@mui/material";
import Explore from "app/components/templates/Explore";
import { Gig } from "app/types";
import { filterByDate } from "app/utils/utils";
import type { NextPage } from "next";
import Head from "next/head";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AnimatedLayout from "app/components/layouts/animatedLayout";
import Link from "next/link";

type fetchResponse = {
  result: Array<Gig>;
};

interface Props {
  bounties: fetchResponse;
}

interface ExploreContextType {
  filterGigs: Function;
  data: Gig[] | unknown;
  isFetching: boolean;
  minDeadline: number;
  setMinDeadline: Function;
  maxDeadline: number;
  setMaxDeadline: Function;
  minCollateral: number;
  setMinCollateral: Function;
  maxCollateral: number;
  setMaxCollateral: Function;
  gigs: Gig[];
  setGigs: Function;
  skills: { label: string }[];
  setSkills: Function;
  loaded: boolean;
  setLoaded: Dispatch<SetStateAction<boolean>>;
}

export const ExploreContext = createContext<ExploreContextType>(
  {} as ExploreContextType
);

const Home: NextPage<Props> = ({ bounties }) => {
  const value = useProviderExplore();
  return (
    <div>
      <Head>
        <title>Spect.Network</title>
        <meta name="description" content="Decentralized gig economy" />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <AnimatedLayout>
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
                  {value.gigs?.length}
                </div>
                <div className="hidden md:flex text-sm flex flex-col justify-end items-end ml-1 mb-1 text-blue-light">
                  Matching Gigs
                </div>
              </div>
            </div>
            <Link href="/myGigs" passHref>
              <Button
                sx={{ textTransform: "none", color: "#eaeaea" }}
                endIcon={<ArrowRightIcon />}
              >
                Track my gigs
              </Button>
            </Link>
          </div>
        </div>
        <ExploreContext.Provider value={value}>
          <Explore />
        </ExploreContext.Provider>
      </AnimatedLayout>
    </div>
  );
};

export function useProviderExplore() {
  const [minDeadline, setMinDeadline] = useState(0);
  const [maxDeadline, setMaxDeadline] = useState(365);
  const [minCollateral, setMinCollateral] = useState(0);
  const [maxCollateral, setMaxCollateral] = useState(Number.MAX_SAFE_INTEGER);
  const [skills, setSkills] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([] as Gig[]);
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
    loaded,
    setLoaded,
  };
}

export const useExplore = () => useContext(ExploreContext);

export default Home;
