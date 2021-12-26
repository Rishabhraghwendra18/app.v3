import { Layout } from "app/components/layouts";
import { GigForm } from "app/components/modules/gigForm/gigForm";
import { NextPage } from "next";
import Head from "next/head";

interface Props {}

const CreateGig: NextPage<Props> = (props: Props) => {
  return (
    <div>
      <Head>
        <title>Create gig</title>
        <meta name="description" content="Create Gig" />
      </Head>
      <Layout>
        <div className="px-12">
          <div className="grid gap-1 grid-cols-6 mt-8">
            <div></div>
            <div className="flex flex-row col-span-5">
              <div className="flex flex-row w-5/6 items-center">
                <span className="text-base text-3xl text-blue-bright">
                  Create Gig
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-1 grid-cols-6 mt-8">
            <div className=""></div>
            <GigForm />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default CreateGig;
