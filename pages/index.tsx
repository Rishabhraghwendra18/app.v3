import { Layout } from "app/components/layouts";
import { useWeb3 } from "app/context/web3Context";
import { filterBounties } from "app/utils/moralis";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useMoralisCloudFunction } from "react-moralis";

interface Props {
  bounties?: Array<object>;
}

const Home: NextPage<Props> = ({ bounties }) => {
  const {
    state: { loading, contracts, userStake, conversionRate, error },
    dispatch,
  } = useWeb3();
  const {
    data,
    error: CloudError,
    isLoading,
  } = useMoralisCloudFunction("filterBounties", {
    tags: [],
    lockedStake: [0, 100000],
    sortBy: "reward",
    sortOrder: "desc",
  });

  useEffect(() => {
    console.log(data);
    console.log(CloudError);
  }, [isLoading]);
  return (
    <div>
      <Head>
        <title>Spect.Network</title>
        <meta name="description" content="Decentralized gig economy" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Layout>
        <div className="text-grey-light p-12">
          {!loading && <div>Hi Start of something new!</div>}
          {loading && <div>Initing contracts please wait</div>}
        </div>
      </Layout>
    </div>
  );
};

export default Home;
