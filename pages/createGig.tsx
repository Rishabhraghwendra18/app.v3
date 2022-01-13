import { GigForm } from "app/components/modules/gigForm";
import { NextPage } from "next";
import Head from "next/head";
import AnimatedLayout from "app/components/layouts/animatedLayout";
import { useEffect, useState } from "react";
import { useGlobal } from "app/context/globalContext";
import InitUserModal from "app/components/elements/modals/initUserModal";

interface Props {}

const CreateGig: NextPage<Props> = (props: Props) => {
  const {
    state: { userInfo },
  } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // if (!userInfo?.get("isInitialized")) {
    //   setIsOpen(true);
    // }
  }, []);

  return (
    <div>
      <Head>
        <title>Create gig</title>
        <meta name="description" content="Create Gig" />
      </Head>
      <AnimatedLayout>
        {isOpen && <InitUserModal isOpen={isOpen} setIsOpen={setIsOpen} />}
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
      </AnimatedLayout>
    </div>
  );
};

export default CreateGig;
