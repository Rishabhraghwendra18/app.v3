import { Avatar, Box, Skeleton, styled, Tabs } from "@mui/material";
import cover2 from "app/images/cover2.jpg";
import { a11yProps } from "app/utils/utils";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../elements/buttons/primaryButton";
import { StyledTab } from "../elements/styledComponents";
import DepositManagement from "../modules/depositManagement";
import ProfileInfo from "../modules/profileInfo";
import ProfileForm from "../modules/profileForm";
import { useProfile } from "pages/profile/[username]";

interface Props {}

export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  height: 180,
  width: 180,
  objectFit: "cover",
  float: "left",
  marginTop: -130,
  position: "relative",
  borderWidth: 2,
}));

const AvatarSkeleton = styled(Skeleton)(({ theme }) => ({
  height: 180,
  width: 180,
  objectFit: "cover",
  float: "left",
  marginTop: -130,
  position: "relative",
  borderWidth: 2,
}));

const ProfileTemplate = (props: Props) => {
  const [tab, setTab] = useState(0);
  const { profileUser: userInfo, loading, editable } = useProfile();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  useEffect(() => {
    console.log(loading);
  }, [loading]);

  return (
    <div className="flex-grow p-0 overflow-hidden mb-16">
      <div
        className="banner"
        style={{
          backgroundImage: `url(${cover2.src})`,
        }}
      />
      <div className="mx-32">
        <div className="mt-4">
          {loading ? (
            <AvatarSkeleton variant="circular" />
          ) : (
            <ProfileAvatar src={userInfo?.get("profilePicture")} />
          )}
          <div className="flex flex-row ml-2">
            <div className="flex flex-col">
              {loading ? (
                <Skeleton variant="text" width={300} animation="wave" />
              ) : (
                <span className="text-2xl">{userInfo?.get("name")}</span>
              )}
              {loading ? (
                <Skeleton variant="text" width={100} animation="wave" />
              ) : (
                <span className="text-sm text-grey-normal">
                  @{userInfo?.get("spectUsername")}
                </span>
              )}
            </div>
            <div className="w-1/5 ml-8">
              <ProfileForm />
            </div>
            <div className="flex-auto"></div>
            {!loading && (
              <div className="flex flex-row text-grey-normal">
                {userInfo?.get("github") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("github")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-github mx-4" />
                  </a>
                )}
                {userInfo?.get("linkedin") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("linkedin")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-linkedin mx-4" />
                  </a>
                )}
                {userInfo?.get("twitter") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("twitter")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-twitter mx-4" />
                  </a>
                )}
                {userInfo?.get("instagram") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("instagram")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-instagram mx-4" />
                  </a>
                )}
                {userInfo?.get("discord") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={`https://discordapp.com/channels/@me/${userInfo?.get(
                      "discord"
                    )}/`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-discord mx-4"></i>
                  </a>
                )}
                {userInfo?.get("behance") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("behance")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-behance mx-4" />
                  </a>
                )}
                {userInfo?.get("website") && (
                  <a
                    className="hover:text-gray-600 transition duration-1000 ease-in-out transform hover:-translate-y-1"
                    href={userInfo?.get("website")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-firefox-browser mx-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-32 mt-4">
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={tab} onChange={handleChange}>
            <StyledTab label="Profile" {...a11yProps(0)} value={0} />
            <StyledTab
              label="Deposit Management"
              {...a11yProps(1)}
              value={1}
              hidden={!editable}
            />
          </Tabs>
        </Box>
        <AnimatePresence exitBeforeEnter initial={false}>
          {tab === 0 && <ProfileInfo key={0} />}
          {tab === 1 && <DepositManagement key={1} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileTemplate;
