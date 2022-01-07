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
import Link from "next/link";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  callConfirmationDeadlineViolation,
  delistGig,
} from "app/utils/contracts";
import { useGlobal } from "app/context/globalContext";

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

export const ViolationConfirmModal = ({ isOpen, setIsOpen }: props) => {
  const handleClose = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const { gig } = useGig();
  const {
    state: { contracts },
  } = useGlobal();

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
              {"Waiting for transaction to complete"}
            </Typography>
          </Box>
        </Backdrop>

        {finished ? (
          <React.Fragment>
            <DialogTitle color="primary">Success</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Violation called succesfully!
              </DialogContentText>
            </DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
                Are you sure you want to call confirmation violation?
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                You can delete the gig or accept another proposal after this.
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
                  callConfirmationDeadlineViolation(
                    gig.dealId,
                    contracts?.dealContract
                  )
                    .then((res) => {
                      setLoading(false);
                      setFinished(true);
                    })
                    .catch((err) => {
                      setLoading(false);
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
