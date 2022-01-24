import AnimatedLayout from "app/components/layouts/animatedLayout";
import GigTemplate from "app/components/templates/Gig";
import { useGlobal } from "app/context/globalContext";
import { ContractGig, Gig, Proposal, Submission, VerifiedGig } from "app/types";
import { getDealMetadata } from "app/utils/contracts";
import { fetchFromIPFS } from "app/utils/moralis";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { Delta } from "quill";

interface Props {}

interface GigContextType {
  gig: Gig;
  setGig: Function;
  contractGig: ContractGig;
  setContractGig: Function;
  verifiedGig: VerifiedGig;
  setVerifiedGig: Function;
  submissions?: Submission[];
  setSubmissions: Function;
  proposals: Array<Proposal>;
  setProposals: Function;
  evidence?: {
    disputeReason: Delta;
  };
  setEvidence: Function;
  fetching: boolean;
  setFetching: Function;
  tab: number;
  setTab: Function;
  getGig: Function;
  getMyProposals: Function;
  revisionInstructions?: any[];
}

export const GigContext = createContext<GigContextType>({} as GigContextType);

const GigPage: NextPage<Props> = (props: Props) => {
  const context = useProviderGig();
  const router = useRouter();
  const { id } = router.query;
  const {
    state: { loading, contracts },
  } = useGlobal();
  const { isInitialized, isInitializing } = useMoralis();

  useEffect(() => {
    const promises: Array<any> = [];
    context.setFetching(true);
    let instructions: any[] = [];
    let submissions: any[] = [];

    if (!loading && isInitialized && !isInitializing) {
      context.getGig({
        onSuccess: (res: Gig[]) => {
          console.log(res);
          context.setGig(res[0]);
          if (res[0]) {
            const status = res[0].status;
            if ([102, 201, 202, 203, 204, 402, 403].includes(status)) {
              promises.push(
                getDealMetadata(res[0].dealId, contracts?.dealContract).then(
                  (deal) => {
                    context.setContractGig(deal);
                  }
                )
              );
            }
            if ([202, 203, 204, 402, 403].includes(status)) {
              console.log(res[0].submissions);
              res[0].submissions.map((submission) => {
                promises.push(
                  fetchFromIPFS(submission).then((res) => {
                    console.log(res);
                    submissions.push(res);
                  })
                );
              });
            }
            if (status === 101) {
              promises.push(
                context.getMyProposals({
                  onSuccess: (res: Proposal[]) => {
                    res = res.slice().reverse();
                    context.setProposals(res);
                  },
                  params: {
                    dealId: id,
                    status: 0,
                    sortOrder: "desc",
                    sortBy: "createdAt",
                  },
                })
              );
            }
            if (status === 204) {
              console.log(res[0].revisionInstructions);
              res[0].revisionInstructions.map((instruction) => {
                promises.push(
                  fetchFromIPFS(instruction).then((res) => {
                    console.log(res);
                    instructions.push(res);
                  })
                );
              });
            }
            if (status === 403) {
              promises.push(
                fetchFromIPFS(res[0].evidence).then((res) => {
                  context.setEvidence(res);
                })
              );
            }
            Promise.all(promises)
              .then(() => {
                context.setRevisionInstructions(instructions);
                context.setSubmissions(submissions);
                console.log(submissions);
                if (router.query.tab) {
                  context.setTab(parseInt(router.query.tab as string));
                }
                context.setFetching(false);
              })
              .catch((err) => {
                console.log(err);
                context.setFetching(false);
              });
          }
        },
        params: {
          id: id,
        },
      });
    }
  }, [loading, isInitialized, router.query.tab, isInitializing]);

  return (
    <div>
      <Head>
        <title>Spect.network Gig</title>
        <meta name="description" content={`Decentralized gig economy`} />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <AnimatedLayout>
        <GigContext.Provider value={context}>
          <GigTemplate />
        </GigContext.Provider>
      </AnimatedLayout>
    </div>
  );
};

export function useProviderGig() {
  const [gig, setGig] = useState<Gig>({} as Gig);
  const [contractGig, setContractGig] = useState<ContractGig>(
    {} as ContractGig
  );
  const [verifiedGig, setVerifiedGig] = useState<VerifiedGig>(
    {} as VerifiedGig
  );
  const [submissions, setSubmissions] = useState<Submission[]>(
    {} as Submission[]
  );
  const [revisionInstructions, setRevisionInstructions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [evidence, setEvidence] = useState();
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState(0);
  const { fetch: getGig } = useMoralisCloudFunction(
    "getBounty",
    {
      limit: 1,
    },
    { autoFetch: false }
  );
  const { fetch: getMyProposals } = useMoralisCloudFunction(
    "getProposals",
    {
      limit: 100,
    },
    { autoFetch: false }
  );

  return {
    gig,
    setGig,
    contractGig,
    setContractGig,
    verifiedGig,
    setVerifiedGig,
    submissions,
    setSubmissions,
    proposals,
    setProposals,
    evidence,
    setEvidence,
    fetching,
    setFetching,
    tab,
    setTab,
    revisionInstructions,
    setRevisionInstructions,
    getGig,
    getMyProposals,
  };
}

export const useGig = () => useContext(GigContext);

export default GigPage;
