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
import { toIPFS, uploadFile } from "app/utils/moralis";
import { useGlobal } from "app/context/globalContext";
import Link from "next/link";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { ISubmissionFormInput } from "./submissionForm";
import { accept, submitContract } from "app/utils/contracts";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { toast, ToastContainer } from "material-react-toastify";
import { useMoralis } from "react-moralis";

interface props {
  isOpen: boolean;
  setIsOpen: Function;
  values: ISubmissionFormInput;
  confirmText1: string;
  confirmText2: string;
  finishText1: string;
  finishText2: string;
  confirmType: 1 | 2 | 3;
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

export const ConfirmModal = ({
  isOpen,
  setIsOpen,
  values,
  confirmText1,
  confirmText2,
  finishText1,
  finishText2,
  confirmType,
}: props) => {
  const handleClose = () => setIsOpen(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [hash, setHash] = useState("");
  const { gig } = useGig();
  const {
    state: { contracts },
  } = useGlobal();

  const { Moralis } = useMoralis();

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
            <CircularProgress color="inherit" id="eLoader" />
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
                {finishText1}
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                {finishText2}
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
                  id="bGotoGig"
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
                {confirmText1}
              </DialogContentText>
              <DialogContentText color="#eaeaea">
                {confirmText2}
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
                id="bConfirm"
                onClick={async () => {
                  switch (confirmType) {
                    case 1:
                      setLoaderText("Uploading file to IPFS, please wait...");
                      setLoading(true);
                      let fileUploaded;
                      if (values.file) {
                        try {
                          fileUploaded = await uploadFile(Moralis, values.file);
                        } catch (err) {
                          console.log(err);
                          setLoading(false);
                          alert(err);
                          return;
                        }
                      }
                      setLoaderText(
                        "Uploading submission metadata to IPFS, please wait"
                      );
                      toIPFS(Moralis, "object", {
                        submissionText: values.comments,
                        submissionFile: fileUploaded?.ipfs(),
                        submissionFilename: values.file?.name,
                        links: values.links,
                      }).then((res) => {
                        setLoaderText(
                          "Waiting for the transaction to complete"
                        );
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
                      break;

                    case 2:
                      setLoaderText("Waiting for the transaction to complete");
                      setLoading(true);
                      accept(gig.dealId, contracts?.dealContract)
                        .then((res) => {
                          setHash(res.transactionHash);
                          setFinished(true);
                          setLoading(false);
                        })
                        .catch((err) => {
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
                  }
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
