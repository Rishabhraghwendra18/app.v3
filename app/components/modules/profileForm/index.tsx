import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fade,
  Modal,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import { animationVariant, modules } from "app/constants/constants";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import InfoForm from "./infoForm";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import LinkForm from "./linkForm";
import ClearIcon from "@mui/icons-material/Clear";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import { useGlobal } from "app/context/globalContext";
import { useMoralis } from "react-moralis";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import EditIcon from "@mui/icons-material/Edit";
import { useProfile } from "pages/profile/[username]";
import { AnimatePresence, motion } from "framer-motion";

interface Props {}
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

const ProfileForm = ({}: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loaderText, setLoaderText] = useState("Updating metadata");
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    state: { userInfo },
    dispatch,
  } = useGlobal();
  const [description, setDescription] = useState();
  const { Moralis } = useMoralis();
  const { editable } = useProfile();

  const handleClose = () => setIsOpen(false);

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  return (
    <div>
      <PrimaryButton
        variant="outlined"
        size="small"
        fullWidth
        endIcon={<EditIcon />}
        hidden={!editable}
        onClick={() => setIsOpen(true)}
        id="bEditProfile"
      >
        Edit Profile
      </PrimaryButton>
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen} timeout={500}>
          <Box sx={modalStyle}>
            <Stepper nonLinear alternativeLabel activeStep={activeStep}>
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
              sx={{
                color: "#eaeaea",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
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
            <AnimatePresence exitBeforeEnter initial={false}>
              {activeStep === 0 && (
                <React.Fragment key={0}>
                  <InfoForm handleNext={handleNext} setLoading={setLoading} />
                </React.Fragment>
              )}
              {activeStep === 1 && (
                <React.Fragment key={1}>
                  <motion.main
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    variants={animationVariant}
                  >
                    <div className="text-grey-light my-12">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        defaultValue={userInfo?.get("description")}
                        onChange={(value, delta, user, editor) => {
                          setDescription(editor.getContents() as any);
                        }}
                        onFocus={() => setIsDirty(true)}
                        placeholder={"Add bio for your profile"}
                        data-testid="bio"
                      />
                      <div className="m-4">
                        <Button
                          variant="contained"
                          endIcon={<SaveIcon />}
                          fullWidth
                          disabled={!isDirty}
                          onClick={() => {
                            setLoading(true);
                            userInfo?.set("description", description);
                            Moralis.Object.saveAll([userInfo as any])
                              .then(([userInfo]) => {
                                setLoading(false);
                                dispatch({
                                  type: "SET_USERINFO",
                                  value: userInfo,
                                });
                                handleNext();
                              })
                              .catch((err) => {
                                console.log(err);
                                setLoading(false);
                                alert(err);
                              });
                          }}
                          data-testid="bioBtnSave"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </motion.main>
                </React.Fragment>
              )}
              {activeStep === 2 && (
                <React.Fragment key={2}>
                  <LinkForm handleClose={handleClose} setLoading={setLoading} />
                </React.Fragment>
              )}
            </AnimatePresence>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleClose}
                sx={{ mr: 1, color: "#f45151" }}
                endIcon={<ClearIcon />}
                data-testid="btnExit"
              >
                Exit
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                disabled={activeStep === steps.length - 1}
                variant="outlined"
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ProfileForm;
