import AnimatedLayout from "app/components/layouts/animatedLayout";
import ProfileTemplate from "app/components/templates/Profile";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

interface Props {}

const ProfilePage: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { username } = router.query;
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Decentralized gig economy" />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <AnimatedLayout>
        <ProfileTemplate />
      </AnimatedLayout>
    </div>
  );
};

export default ProfilePage;
