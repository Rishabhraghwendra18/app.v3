import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useState } from "react";
import { useGig } from "pages/gig/[id]";
import { createProposal } from "app/utils/moralis";
import { useGlobal } from "app/context/web3Context";
import Link from "next/link";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { IProposalFormInput } from ".";

interface props {
  isOpen: boolean;
  setIsOpen: Function;
  values: IProposalFormInput;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export const ConfirmModal = ({ isOpen, setIsOpen, values }: props) => {
  const handleClose = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const { gig } = useGig();

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="inherit" />
            <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
              {"Sending your proposal"}
            </Typography>
          </Box>
        </Backdrop>

        {finished ? (
          <React.Fragment>
            <DialogTitle color="primary">Success</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Proposal sent succesfully!
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                Client will review your proposal now
              </DialogContentText>
            </DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Link href={`/gig/${gig.dealId}`} passHref>
                <Button variant="outlined" endIcon={<ArrowCircleRightIcon />}>
                  Go to gig!
                </Button>
              </Link>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogTitle color="primary">Confirm?</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Are you sure you want to send this proposal?
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                You cannot send another proposal!
              </DialogContentText>
            </DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                px: 2.5,
                py: 1.5,
              }}
            >
              <Button
                color="inherit"
                onClick={handleClose}
                variant="outlined"
                sx={{ mr: 1, color: "#f45151", textTransform: "none" }}
                endIcon={<ClearIcon />}
              >
                Nevermind
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                endIcon={<DoneIcon />}
                onClick={() => {
                  setLoading(true);
                  createProposal(
                    gig.dealId,
                    values?.title,
                    values?.description,
                    values?.minStake,
                    new Date(values?.deadline).toUTCString()
                  ).then((res) => {
                    setLoading(false);
                    setFinished(true);
                  });
                }}
                sx={{ mr: 1, textTransform: "none" }}
                variant="outlined"
              >
                Hell yeah!
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};
