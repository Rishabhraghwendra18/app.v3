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
import React, { useEffect, useState } from "react";
import { Proposal } from "app/types";
import { useGig } from "pages/gig/[id]";
import { toIPFS } from "app/utils/moralis";
import {
  callSubmissionDeadlineViolation,
  firstConfirmation,
} from "app/utils/contracts";
import { useGlobal } from "app/context/globalContext";
import Link from "next/link";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import { toast, ToastContainer } from "material-react-toastify";
import { useMoralis } from "react-moralis";

interface props {
  isOpen: boolean;
  setIsOpen: Function;
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

export const ConfirmViolationModal = ({ isOpen, setIsOpen }: props) => {
  const handleClose = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [finished, setFinished] = useState(false);
  const [hash, setHash] = useState("");
  const { gig } = useGig();
  const {
    state: { contracts },
  } = useGlobal();
  const { Moralis } = useMoralis();
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
                Deadline violation called successfully!
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                Escrow along with the compensation has been transferred to your
                deposit.
              </DialogContentText>
            </DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, px: 1 }}>
              <a
                href={`https://polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  sx={{ color: "#99ccff" }}
                  color="inherit"
                  endIcon={<AssignmentIcon />}
                >
                  View transaction
                </Button>
              </a>
              <Box sx={{ flex: "1 1 auto" }} />
              <Link
                href={{
                  pathname: `/gig/${gig.dealId}`,
                  query: {
                    tab: 0,
                  },
                }}
                as={`/gig/${gig.dealId}`}
                passHref
              >
                <Button
                  variant="outlined"
                  endIcon={<ArrowCircleRightIcon />}
                  onClick={handleClose}
                >
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
                Are you sure you want to call dealdine violation?
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                You will receive your escrow back along with some compensation.
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
                sx={{ mr: 1, textTransform: "none" }}
                variant="outlined"
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  callSubmissionDeadlineViolation(
                    gig.dealId,
                    contracts?.dealContract
                  )
                    .then((res) => {
                      const hash = res.transactionHash;
                      setHash(hash);
                      setLoading(false);
                      setFinished(true);
                    })
                    .catch((err) => {
                      toast.error(err.message, {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        className: "text-sm text-grey-spect border-blue-500",
                      });
                      console.log(err);
                      setLoading(false);
                    });
                }}
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
