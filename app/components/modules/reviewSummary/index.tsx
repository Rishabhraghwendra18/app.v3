import React from "react";
import { Avatar, Button, Chip, Grid, Rating, styled, Typography } from "@mui/material";
import Link from "next/link";
import { formatTimeAgo } from "app/utils/utils";
import { Box } from "@mui/system";
import { useGlobal } from "app/context/globalContext";
import { Gig } from "app/types";

type Props = {
  gig: Gig;
};

const GigSummaryButton = styled(Button)(({ theme }) => ({
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

const ReviewSummary = ({ gig }: Props) => {
  const {
    state: { conversionRate },
  } = useGlobal();
  return (
    <Link href={`/gig/${gig.dealId}`} passHref>
      <GigSummaryButton variant="outlined" sx={{ pt: 1, mb: 1 }}>
        <Grid container spacing={1} columns={5} sx={{ textTransform: "none" }}>
          <Grid item xs={2}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <GigAvatar
                alt="Username"
                src={
                  gig.user && gig.user[0].organizationVerified
                    ? gig.user[0].organizationPicture
                    : gig.user[0].profilePicture
                }
              />
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
                  {gig.name}
                </Typography>
                <Typography
                  sx={{
                    color: "#979797",
                    textTransform: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  @{gig.clientUsername}
                </Typography>

                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <div className="grid grid-cols-3">
                      {gig.tags.map((data, idx) => {
                        return (
                          <Chip
                            label={data}
                            key={idx}
                            size="small"
                            sx={{
                              mt: 1,
                              mr: 0.8,
                              textTransform: "none",
                              color: "#99ccff",
                              fontSize: "0.7rem",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <Typography
                    sx={{
                      color: "#979797",
                      fontSize: "0.7rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                      mx: 0,
                      mb: 0.5,
                    }}
                  >
                    {/*Posted {formatTimeAgo(Date.parse(gig.createdAt))} ago*/}
                  </Typography>
                </div>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col">
              <div className="flex flex-row items-baseline">
                <div className="text-grey-light font-bold text-xl mr-2">{gig.reward.toFixed(2)}</div>
                <div className="text-grey-normal">Wmatic</div>
              </div>
              <div className="flex flex-col items-left w-1/2">
                <Chip
                  label={`${((conversionRate || 0) * gig.reward).toFixed(2)} USD`}
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
              <Rating value={gig.rating} readOnly />
            </div>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col">
              <div className="text-base text-grey-light">{gig.review}</div>
            </div>
          </Grid>
        </Grid>
      </GigSummaryButton>
    </Link>
  );
};

export default ReviewSummary;
