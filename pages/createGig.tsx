import { Layout } from "app/components/layouts";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";

interface Props {}

const CreateGig: NextPage<Props> = (props: Props) => {
  return (
    <div>
      <Head>
        <title>Create gig</title>
        <meta name="description" content="Create Gig" />
      </Head>
      <Layout>
        <div className="text-grey-light p-12">Create your gig budday</div>
      </Layout>
    </div>
  );
};

export default CreateGig;
