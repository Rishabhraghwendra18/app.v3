import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Grow,
  Modal,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { Proposal } from "app/types";
import { useGig } from "pages/gig/[id]";
import { toIPFS } from "app/utils/moralis";
import { firstConfirmation } from "app/utils/contracts";
import { useGlobal } from "app/context/web3Context";
import Link from "next/link";
import { toast, ToastContainer } from "material-react-toastify";

interface props {
  isOpen: boolean;
  setIsOpen: Function;
  proposal: Proposal;
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

export const ConfirmModal = ({ isOpen, setIsOpen, proposal }: props) => {
  const handleClose = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [finished, setFinished] = useState(false);
  const [hash, setHash] = useState("");
  const { gig } = useGig();
  const {
    state: { contracts },
  } = useGlobal();
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <ToastContainer />

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
              {loaderText}
            </Typography>
          </Box>
        </Backdrop>

        {finished ? (
          <React.Fragment>
            <DialogTitle color="primary">Success</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Proposal accepted succesfully!
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                Freelancer will start work within a day from now.
              </DialogContentText>
            </DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <a
                href={`https://mumbai.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button sx={{ textTransform: "none" }}>View transaction</Button>
              </a>
              <Link href={`/gig/${gig.dealId}`} passHref>
                <Button sx={{ textTransform: "none" }}>Go to gig!</Button>
              </Link>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DialogTitle color="primary">Confirm?</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Are you sure you want to accept this proposal? It cannot be
                undone.
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                This will be then sent to freelancer for second confirmation
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
                  setLoaderText(
                    "Uploading proposal metadata to IPFS, please wait"
                  );
                  setLoading(true);
                  toIPFS("object", {
                    name: gig.name,
                    tags: gig.tags,
                    description: gig.description,
                    proposalTitle: proposal.title,
                    proposal: proposal.proposalText,
                    revisions: proposal.numRevisions,
                  }).then((res) => {
                    setLoaderText("Waiting for the transaction to complete");
                    const ipfsUrlArray = res.path.split("/");
                    firstConfirmation(
                      proposal.deadline,
                      proposal.user[0].ethAddress,
                      proposal.lockedStake,
                      gig.dealId,
                      ipfsUrlArray[ipfsUrlArray.length - 1],
                      contracts?.dealContract
                    )
                      .then((res) => {
                        setHash(res.transactionHash);
                        setLoading(false);
                        setFinished(true);
                      })
                      .catch((err) => {
                        setLoading(false);
                        toast.error(err.message, {
                          position: "bottom-center",
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                      });
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
