import { Avatar, Button, Chip, Grid, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { monthMap } from "app/constants/constants";
import { Gig, Proposal } from "app/types";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useGlobal } from "app/context/globalContext";
import { formatTimeAgo } from "app/utils/utils";
import Link from "next/link";

interface Props {
  proposal: Proposal;
}

const ProposalSummaryButton = styled(Button)(({ theme }) => ({
  width: "100%",
  borderColor: "#99ccff",
  borderRadius: "2rem",
  display: "flex",
  justifyContent: "flex-start",
}));

export const GigAvatar = styled(Avatar)(({ theme }) => ({
  width: "5rem",
  height: "5rem",
  objectFit: "cover",
}));

const ProposalSummary = ({ proposal }: Props) => {
  const {
    state: { conversionRate },
  } = useGlobal();
  const [gig, setGig] = useState<Gig>({} as Gig);
  useEffect(() => {
    setGig(proposal.bounty[0]);
  }, []);
  return (
    <Link
      href={{
        pathname: `/gig/${gig?.dealId}`,
        query: {
          tab: 3,
        },
      }}
      as={`/gig/${gig?.dealId}`}
      passHref
    >
      <ProposalSummaryButton variant="outlined" sx={{ pt: 1, mb: 1 }}>
        <Grid container spacing={1} columns={7} sx={{ textTransform: "none" }}>
          <Grid item xs={4}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <GigAvatar alt="Username" src={proposal.user?.get("profilePicture")} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                  ml: 4,
                  mr: 2,
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    color: "#eaeaea",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {gig?.name}
                </Typography>
                <Typography
                  sx={{
                    color: "#979797",
                    textTransform: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  @{gig?.clientUsername}
                </Typography>

                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <div className="grid grid-cols-3">
                      <Chip
                        label={`${proposal.title}`}
                        size="small"
                        sx={{
                          mt: 1,
                          mr: 0.8,
                          textTransform: "none",
                          color: "#99ccff",
                          fontSize: "0.7rem",
                          width: "20rem",
                        }}
                      />
                    </div>
                  </div>
                  <Typography
                    sx={{
                      color: "#979797",
                      fontSize: "0.7rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                      mx: 1,
                      mb: 0.5,
                    }}
                  >
                    Submitted {formatTimeAgo(Date.parse(proposal.createdAt))} ago
                  </Typography>
                  <Typography
                    sx={{
                      color: "#979797",
                      textTransform: "none",
                      fontSize: "0.7rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                      mx: 1,
                      mb: 0.5,
                    }}
                  >
                    {/*<PersonIcon sx={{ fontSize: "1rem" }} />
                    {gig?.numApplicants} Applicants*/}
                  </Typography>
                </div>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col">
              <div className="flex flex-row items-baseline">
                <div className="text-grey-light font-bold text-xl mr-2">{gig?.reward?.toFixed(2)}</div>
                <div className="text-grey-normal">Wmatic</div>
              </div>
              <div className="flex flex-col items-left w-1/2">
                <Chip
                  label={`${((conversionRate || 0) * gig?.reward).toFixed(2)} USD`}
                  size="small"
                  sx={{
                    mt: 1,
                    mr: 0.8,
                    bgcolor: "#99ccff",
                    color: "#0061ff",
                    fontSize: "0.7rem",
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col">
              <div className="flex flex-row items-baseline">
                <div className="text-grey-light font-bold text-xl mr-2">{proposal?.deadline?.getDate()}</div>
                <div className="text-grey-normal">
                  {monthMap[proposal?.deadline?.getMonth()]} {proposal?.deadline?.getFullYear()}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col">
              <div className="flex flex-row items-baseline">
                <div className="text-grey-light font-bold text-xl mr-2">{proposal.lockedStake.toFixed(2)}</div>
                <div className="text-grey-normal">Wmatic</div>
              </div>
            </div>
          </Grid>
        </Grid>
      </ProposalSummaryButton>
    </Link>
  );
};

export default ProposalSummary;
