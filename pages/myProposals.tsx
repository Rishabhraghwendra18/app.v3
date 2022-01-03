import { Button } from "@mui/material";
import { Proposal, ProposalStatus } from "app/types";
import type { NextPage } from "next";
import Head from "next/head";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useMoralisCloudFunction } from "react-moralis";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AnimatedLayout from "app/components/layouts/animatedLayout";
import Link from "next/link";
import MyProposalsTemplate from "app/components/templates/MyProposals";

interface Props {}

interface MyProposalsContextType {
  getMyProposals: Function;
  data: Proposal[] | unknown;
  isFetching: boolean;
  myProposals: Proposal[] | undefined;
  setMyProposals: Dispatch<SetStateAction<Proposal[] | undefined>>;
  status: ProposalStatus;
  setStatus: Dispatch<SetStateAction<ProposalStatus | undefined>>;
  loaded: boolean;
  setLoaded: Dispatch<SetStateAction<boolean>>;
}

export const MyProposalsContext = createContext<MyProposalsContextType>(
  {} as MyProposalsContextType
);

const MyProposals: NextPage<Props> = () => {
  const value = useProviderMyProposals();

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
              My Proposals
            </span>
            <div className="flex flex-row ml-8 justify-center">
              <div className="text-base md:text-2xl lg:text-3xl mt-1 text-blue-light">
                {" "}
                {value.myProposals?.length}
              </div>
              <div className="hidden md:flex text-sm flex flex-col justify-end items-end ml-1 mb-1 text-blue-light">
                Matching Proposals
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
        <MyProposalsContext.Provider value={value}>
          <MyProposalsTemplate />
        </MyProposalsContext.Provider>
      </AnimatedLayout>
    </div>
  );
};

export function useProviderMyProposals() {
  const [status, setStatus] = useState<ProposalStatus>(101);
  const [myProposals, setMyProposals] = useState<Proposal[] | undefined>([]);
  const [loaded, setLoaded] = useState(false);

  const {
    fetch: getMyProposals,
    data,
    error,
    isFetching,
  } = useMoralisCloudFunction(
    "getMySubmittedProposals",
    {
      limit: 100,
    },
    { autoFetch: false }
  );

  return {
    getMyProposals,
    data,
    isFetching,
    myProposals,
    setMyProposals,
    status,
    setStatus,
    loaded,
    setLoaded,
  };
}

export const useMyProposals = () => useContext(MyProposalsContext);

export default MyProposals;
