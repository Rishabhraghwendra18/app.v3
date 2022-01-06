import AnimatedLayout from "app/components/layouts/animatedLayout";
import GigTemplate from "app/components/templates/Gig";
import { useGlobal } from "app/context/globalContext";
import { ContractGig, Gig, Proposal, Submission, VerifiedGig } from "app/types";
import { getDealMetadata } from "app/utils/contracts";
import { fetchFromIPFS, getGig, getMyProposals } from "app/utils/moralis";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

interface Props {}

interface GigContextType {
  gig: Gig;
  setGig: Function;
  contractGig: ContractGig;
  setContractGig: Function;
  verifiedGig: VerifiedGig;
  setVerifiedGig: Function;
  submission?: Submission;
  setSubmission: Function;
  proposals: Array<Proposal>;
  setProposals: Function;
  evidence?: object;
  setEvidence: Function;
  fetching: boolean;
  setFetching: Function;
  tab: number;
  setTab: Function;
}

export const GigContext = createContext<GigContextType>({} as GigContextType);

const GigPage: NextPage<Props> = (props: Props) => {
  const context = useProviderGig();
  const router = useRouter();
  const { id } = router.query;
  const {
    state: { loading, contracts },
  } = useGlobal();
  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    const promises: Array<any> = [];
    context.setFetching(true);
    if (!loading && isAuthenticated) {
      getGig(id).then((res: Array<Gig>) => {
        context.setGig(res[0]);
        if (res[0]) {
          const status = res[0].status;
          if ([102, 201, 202, 203, 204, 402, 403].includes(status)) {
            promises.push(
              getDealMetadata(res[0].dealId, contracts?.dealContract).then(
                (deal) => {
                  context.setContractGig(deal);
                  if ([202, 203, 204, 403].includes(status)) {
                    fetchFromIPFS(deal.submission).then((res) => {
                      context.setSubmission(res);
                    });
                  }
                }
              )
            );
          }
          if (status === 101) {
            promises.push(
              getMyProposals(id, 0, "desc", "createdAt").then((res) => {
                context.setProposals(res.reverse());
              })
            );
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
      });
    }
  }, [loading, isAuthenticated, router.query.tab]);

  return (
    <div>
      <Head>
        <title>Gig</title>
        <meta name="description" content="Gig" />
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
  const [submission, setSubmission] = useState<Submission>({} as Submission);
  const [proposals, setProposals] = useState<Array<Proposal>>([]);
  const [evidence, setEvidence] = useState();
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState(0);

  return {
    gig,
    setGig,
    contractGig,
    setContractGig,
    verifiedGig,
    setVerifiedGig,
    submission,
    setSubmission,
    proposals,
    setProposals,
    evidence,
    setEvidence,
    fetching,
    setFetching,
    tab,
    setTab,
  };
}

export const useGig = () => useContext(GigContext);

export default GigPage;
