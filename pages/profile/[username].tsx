import AnimatedLayout from "app/components/layouts/animatedLayout";
import ProfileTemplate from "app/components/templates/Profile";
import { useGlobal } from "app/context/globalContext";
import { getUser } from "app/utils/moralis";
import { ethers } from "ethers";
import Moralis from "moralis/types";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMoralis } from "react-moralis";

interface Props {}

interface ProfileContextType {
  profileUser: Moralis.Object;
  setProfileUser: Dispatch<SetStateAction<Moralis.Object<Moralis.Attributes>>>;
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  profileUserStake: ProfileUserStake;
  setProfileUserStake: Dispatch<SetStateAction<ProfileUserStake>>;
}

const ProfileContext = createContext<ProfileContextType>(
  {} as ProfileContextType
);

const ProfilePage: NextPage<Props> = (props: Props) => {
  const context = useProviderProfile();
  const {
    state: { loading, userInfo, contracts, userStake },
  } = useGlobal();
  const router = useRouter();
  const { username } = router.query;
  const { isInitialized } = useMoralis();
  useEffect(() => {
    if (!loading && isInitialized) {
      if (userInfo?.get("spectUsername") === username) {
        context.setEditable(true);
        context.setProfileUser(userInfo as Moralis.Object);
        context.setProfileUserStake(userStake as ProfileUserStake);
        context.setLoading(false);
      } else {
        const initProfileUser = async () => {
          const user = await getUser(username as string);
          const deposit = await contracts?.userContract.getDeposit(
            user?.get("ethAddress")
          );
          const collateral = await contracts?.userContract.getCollateral(
            user?.get("ethAddress")
          );
          context.setProfileUser(user);
          context.setProfileUserStake({
            collateral: parseFloat(ethers.utils.formatEther(collateral)),
            deposit: parseFloat(ethers.utils.formatEther(deposit)),
          });
          context.setLoading(false);
        };
        context.setLoading(true);
        initProfileUser();
      }
    }
  }, [loading]);
  return (
    <div>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Decentralized gig economy" />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <AnimatedLayout>
        <ProfileContext.Provider value={context}>
          <ProfileTemplate />
        </ProfileContext.Provider>
      </AnimatedLayout>
    </div>
  );
};

type ProfileUserStake = {
  collateral: number;
  deposit: number;
};

export function useProviderProfile() {
  const [profileUser, setProfileUser] = useState<Moralis.Object>(
    {} as Moralis.Object
  );
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileUserStake, setProfileUserStake] = useState<ProfileUserStake>(
    {} as ProfileUserStake
  );

  return {
    profileUser,
    setProfileUser,
    editable,
    setEditable,
    loading,
    setLoading,
    profileUserStake,
    setProfileUserStake,
  };
}

export const useProfile = () => useContext(ProfileContext);

export default ProfilePage;
