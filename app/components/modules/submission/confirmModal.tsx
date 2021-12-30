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
import { createProposal, toIPFS, uploadFile } from "app/utils/moralis";
import { useGlobal } from "app/context/web3Context";
import Link from "next/link";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { ISubmissionFormInput } from "./submissionForm";
import { formatTimeLeft } from "app/utils/utils";
import { submitContract } from "app/utils/contracts";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { toast, ToastContainer } from "material-react-toastify";

interface props {
  isOpen: boolean;
  setIsOpen: Function;
  values: ISubmissionFormInput;
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
  const [loaderText, setLoaderText] = useState("");
  const [hash, setHash] = useState("");
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
              {loaderText}
            </Typography>
          </Box>
        </Backdrop>
        <ToastContainer />

        {finished ? (
          <React.Fragment>
            <DialogTitle color="primary">Success</DialogTitle>
            <DialogContent>
              <DialogContentText color="#eaeaea">
                Submission sent succesfully!
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                Client will review your submission now and get back to you
                within {gig.timeToAcceptInDays} day(s).
              </DialogContentText>
            </DialogContent>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, px: 1 }}>
              <a
                href={`https://mumbai.polygonscan.com/tx/${hash}`}
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
                Are you sure you want to send this submission?
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                This submission will be considered final and you cannot edit it!
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
                onClick={async () => {
                  setLoaderText("Uploading file to IPFS, please wait...");
                  setLoading(true);
                  let fileUploaded;
                  if (values.file) {
                    try {
                      fileUploaded = await uploadFile(values.file);
                    } catch (err) {
                      console.log(err);
                      setLoading(false);
                      alert(err);
                    }
                  }
                  setLoaderText(
                    "Uploading submission metadata to IPFS, please wait"
                  );
                  toIPFS("object", {
                    submissionText: values.comments,
                    submissionFile: fileUploaded?.ipfs(),
                    submissionFilename: values.file.name,
                    links: values.links,
                  }).then((res) => {
                    setLoaderText("Waiting for the transaction to complete");
                    const ipfsUrlArray = res.path.split("/");
                    submitContract(
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
