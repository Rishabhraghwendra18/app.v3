import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Modal,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import { modules } from "app/constants/constants";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import InfoForm from "./infoForm";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import LinkForm from "./linkForm";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // values: IGigFormInput;
}
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
};

const steps = ["Personal Info", "Bio", "Social Links"];

const ProfileForm = ({ isOpen, setIsOpen }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loaderText, setLoaderText] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const handleClose = () => setIsOpen(false);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <Backdrop
          sx={{ color: "#eaeaea", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
        {activeStep === 0 && (
          <React.Fragment>
            <InfoForm />
          </React.Fragment>
        )}
        {activeStep === 1 && (
          <React.Fragment>
            <div className="text-grey-light my-4">
              <ReactQuill
                theme="snow"
                modules={modules}
                defaultValue={description}
                placeholder={"Add bio for your profile"}
              />
            </div>
          </React.Fragment>
        )}
        {activeStep === 2 && (
          <React.Fragment>
            <LinkForm />
          </React.Fragment>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button onClick={handleNext} sx={{ mr: 1 }} variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileForm;
