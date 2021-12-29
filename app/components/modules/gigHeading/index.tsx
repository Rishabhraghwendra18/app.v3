import {
  Avatar,
  Chip,
  Collapse,
  Grow,
  styled,
  Tabs,
  Tab,
  Tooltip,
  Fade,
} from "@mui/material";
import Link from "next/link";
import { useGig } from "pages/gig/[id]";
import React, { useEffect } from "react";
import { formatTimeAgo, formatTimeLeft } from "app/utils/utils";
import { gigStatusMapping } from "app/constants/constants";
import { Box } from "@mui/system";
import { useGlobal } from "app/context/web3Context";

interface Props {}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "1.2rem",
  marginRight: 25,
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const HeadingAvatar = styled(Avatar)(({ theme }) => ({
  width: "6rem",
  height: "6rem",
  objectFit: "cover",
}));

export const GigHeading = (props: Props) => {
  const { fetching, gig, tab, setTab } = useGig();
  const {
    state: { userInfo },
  } = useGlobal();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Fade in={!fetching} timeout={500}>
      <div>
        <div className="flex flex-row w-full">
          <div className="flex flex-row pt-4 w-3/4">
            <div className="mr-8 transform transition duration-1000 ease-in-out hover:scale-105">
              <Link href={`/profile/`} passHref>
                <HeadingAvatar
                  alt="Username"
                  src={gig.user[0].profilePicture}
                />
              </Link>
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-3xl font-semibold">{gig.name}</span>
              <div className="text-xs md:text-sm flex flex-row text-grey-normal">
                <span>@{gig.user[0].spectUsername}</span>
                <Link href={`/profile/${gig.user[0].spectUsername}`} passHref>
                  <Tooltip title="Go to profile" arrow placement="right">
                    <i className="fas fa-external-link-alt mx-2"></i>
                  </Tooltip>
                </Link>
              </div>
              <div className="flex flex-row pt-4 items-center">
                {gig.tags.map((data, idx) => {
                  return (
                    <Chip
                      label={data}
                      key={idx}
                      size="small"
                      sx={{
                        mr: 0.8,
                        textTransform: "none",
                        color: "#99ccff",
                        fontSize: "0.7rem",
                      }}
                    />
                  );
                })}
                <div className="hidden md:flex text-xs mx-8">
                  Posted {formatTimeAgo(Date.parse(gig.createdAt))} ago
                </div>
                <div className="text-xs flex flex-row mr-8">
                  {[101, 102, 201, 202].includes(gig.status) && (
                    <i className="fas fa-circle flex flex-col justify-center mr-1 text-green-400 animate-pulse"></i>
                  )}
                  {[203, 401, 402, 403].includes(gig.status) && (
                    <i className="fas fa-circle flex flex-col justify-center mr-1 text-red-400"></i>
                  )}
                  <div className="flex flex-col items-center justify-center">
                    {gigStatusMapping[gig.status]}
                  </div>
                </div>
                <div className="text-xs  flex flex-row mr-8">
                  <i className="fas fa-user flex flex-col justify-center mr-1"></i>
                  <div className="flex flex-col items-center justify-center">
                    {gig.numApplicants || 0} Applicants
                  </div>
                </div>
              </div>
              <div className="flex flex-row pt-4">
                {!fetching && [201, 202, 402, 403].includes(gig.status) && (
                  <div className="flex flex-row hover:text-blue-spectbright mr-8 transform transition-colors ease-in-out duration-1000">
                    <div className="flex flex-col mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col ">
                      <a
                        className="text-center text-xs "
                        href={`https://polygonscan.com/tx/${gig.verifiableBounty?.get(
                          "transaction_hash"
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Transaction
                      </a>
                    </div>
                  </div>
                )}
                {!fetching && [202, 203, 402, 403].includes(gig.status) && (
                  <div className="flex flex-row hover:text-blue-spectbright mr-8 transform transition-colors ease-in-out duration-1000">
                    <div className="flex flex-col mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col ">
                      <a
                        className="text-center text-xs "
                        href={`https://polygonscan.com/tx/${gig.submissionTransaction?.get(
                          "transaction_hash"
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Submission Transaction
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {gig.status < 203 && (
            <div className="flex flex-col pt-4 w-1/4 text-right">
              <span className="text-base text-blue-light">
                Gig Submission Closes in
              </span>
              <span className="text-xl font-bold">
                {formatTimeLeft(gig.deadline)}
              </span>
            </div>
          )}
        </div>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <StyledTab label="Client Brief" {...a11yProps(0)} value={0} />
            {[101].includes(gig.status) &&
              gig.clientUsername === userInfo?.get("spectUsername") && (
                <StyledTab label="Proposals" {...a11yProps(1)} value={1} />
              )}
            {[101].includes(gig.status) &&
              gig.clientUsername !== userInfo?.get("spectUsername") && (
                <StyledTab
                  label="Submit Proposal"
                  {...a11yProps(2)}
                  value={2}
                />
              )}
            {[101, 102, 201, 202, 203].includes(gig.status) &&
              gig.proposal.length &&
              gig.proposal[0].freelancer === userInfo?.get("spectUsername") && (
                <StyledTab
                  label="Submitted Proposal"
                  {...a11yProps(3)}
                  value={3}
                />
              )}
            {[102, 201, 202].includes(gig.status) &&
              gig.clientUsername === userInfo?.get("spectUsername") && (
                <StyledTab
                  label="Selected Proposal"
                  {...a11yProps(4)}
                  value={4}
                />
              )}
            {[201, 202, 203, 403].includes(gig.status) &&
              (gig.clientUsername === userInfo?.get("spectUsername") ||
                (gig.proposal.length &&
                  gig.proposal[0].freelancer ===
                    userInfo?.get("spectUsername"))) && (
                <StyledTab label="Submissions" {...a11yProps(5)} value={5} />
              )}
            {[403].includes(gig.status) &&
              (gig.clientUsername === userInfo?.get("spectUsername") ||
                (gig.proposal.length &&
                  gig.proposal[0].freelancer ===
                    userInfo?.get("spectUsername"))) && (
                <StyledTab label="Dispute" {...a11yProps(6)} value={6} />
              )}
          </Tabs>
        </Box>
      </div>
    </Fade>
  );
};
