import {
  Avatar,
  Button,
  Chip,
  ListItem,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Gig } from "app/types";
import React from "react";

interface Props {
  gig: Gig;
}

const ImageButton = styled(Button)(({ theme }) => ({
  width: "100%",
  borderColor: "#99ccff",
  borderRadius: "2rem",
  display: "flex",
  justifyContent: "flex-start",
}));

const GigAvatar = styled(Avatar)(({ theme }) => ({
  width: "5rem",
  height: "5rem",
  objectFit: "cover",
}));

const GigSummary = ({ gig }: Props) => {
  return (
    <ImageButton variant="outlined" sx={{ my: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
        <GigAvatar alt="Remy Sharp" src={gig.user[0].profilePicture} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            // justifyContent: "center",
            // alignItems: "center",
            mx: 6,
            my: 0.5,
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {gig.tags.map((data, idx) => {
              return (
                <Chip
                  label={data}
                  key={idx}
                  size="small"
                  sx={{ mt: 1, mr: 0.8, textTransform: "none" }}
                />
              );
            })}
            <Typography
              sx={{
                color: "#979797",
                textTransform: "none",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                mx: 1,
              }}
            >
              Posted 5 min ago
            </Typography>
            <Typography
              sx={{
                color: "#979797",
                textTransform: "none",
                fontSize: "0.9rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "end",
                mx: 1,
              }}
            >
              3 Applicants
            </Typography>
          </Box>
        </Box>
      </Box>
    </ImageButton>
  );
};

export default GigSummary;
