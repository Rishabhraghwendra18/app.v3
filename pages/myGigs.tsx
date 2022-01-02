import { Button } from "@mui/material";
import { Layout } from "app/components/layouts";
import Explore from "app/components/templates/Explore";
import { Gig, GigStatus } from "app/types";
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
import MyGigsTemplate from "app/components/templates/MyGigs";
import AnimatedLayout from "app/components/layouts/animatedLayout";
import Link from "next/link";

interface Props {}

interface MyGigsContextType {
  filterMyGigs: Function;
  data: Array<Gig> | unknown;
  isFetching: boolean;
  myGigs: Array<Gig> | undefined;
  setMyGigs: Dispatch<SetStateAction<Gig[] | undefined>>;
  status: GigStatus;
  setStatus: Dispatch<SetStateAction<GigStatus | undefined>>;
}

export const MyGigsContext = createContext<MyGigsContextType>(
  {} as MyGigsContextType
);

const MyGigs: NextPage<Props> = () => {
  const value = useProviderMyGigs();
  const { isInitialized } = useMoralis();
  useEffect(() => {
    if (isInitialized) {
      value.filterMyGigs({
        onSuccess: (res: Array<Gig>) => {
          value.setMyGigs(res);
        },
        params: {
          sortBy: "reward",
          sortOrder: "asc",
          status: value.status,
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
      <div className="grid gap-1 grid-cols-6 mt-4 md:mt-8">
        <div></div>
        <div className="flex flex-row col-span-5">
          <div className="flex flex-row w-5/6 items-center">
            <span className="text-base md:text-2xl lg:text-3xl text-blue-bright">
              My Gigs
            </span>
            <div className="flex flex-row ml-8 justify-center">
              <div className="text-base md:text-2xl lg:text-3xl mt-1 text-blue-light">
                {" "}
                {value.myGigs?.length}
              </div>
              <div className="hidden md:flex text-sm flex flex-col justify-end items-end ml-1 mb-1 text-blue-light">
                Matching Gigs
              </div>
            </div>
          </div>
          <Link href="/" passHref>
            <Button
              sx={{ textTransform: "none", color: "#eaeaea" }}
              endIcon={<ArrowRightIcon />}
            >
              Explore gigs
            </Button>
          </Link>
        </div>
      </div>
      <AnimatedLayout>
        <MyGigsContext.Provider value={value}>
          <MyGigsTemplate />
        </MyGigsContext.Provider>
      </AnimatedLayout>
    </div>
  );
};

export function useProviderMyGigs() {
  const [status, setStatus] = useState<GigStatus>(101);
  const [myGigs, setMyGigs] = useState<Gig[] | undefined>([]);
  const {
    fetch: filterMyGigs,
    data,
    error,
    isFetching,
  } = useMoralisCloudFunction(
    "filterMyBounties",
    {
      limit: 100,
    },
    { autoFetch: false }
  );

  return {
    filterMyGigs,
    data,
    isFetching,
    myGigs,
    setMyGigs,
    status,
    setStatus,
  };
}

export const useMyGigs = () => useContext(MyGigsContext);

export default MyGigs;
