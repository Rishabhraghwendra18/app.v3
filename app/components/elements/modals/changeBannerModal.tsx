import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Backdrop,
  CircularProgress,
  Fade,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { validateEmail } from "app/utils/utils";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const steps = ["Initalize User", "Confirm"];

const ChangeBannerModal = ({ isOpen, setIsOpen }: props) => {
  const handleClose = (event, reason) => {
    // for closing the modal this can be helpful
    if (reason && reason == "backdropClick") return;
    setIsOpen(false);
  };

  const submit = () => {
    console.log("Call this function on submission");
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    color: "white",
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableEscapeKeyDown
    >
      <Fade in={isOpen} timeout={500}>
        <Box sx={modalStyle}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Select a banner type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="default"
                control={<Radio />}
                label="Default"
              />
              <FormControlLabel
                value="newBanner"
                control={<Radio />}
                label="New Banner"
              />
            </RadioGroup>
          </FormControl>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2,width:"100%" }}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setIsOpen(false)}
            sx={{ mr: 1, color: "#f45151" }}
            id="bCancel"
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsOpen(false)}
            id="bApprove"
          >
            Save
          </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
export default ChangeBannerModal;
