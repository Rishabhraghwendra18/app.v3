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

const InitUserModal = ({ isOpen, setIsOpen }: props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("Updating Metadata..");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [validUsername, setValidUsername] = useState(true);
  const [validEmail, setvalidEmail] = useState(true);
  const {
    state: { userInfo },
    dispatch,
  } = useGlobal();
  const { fetch: checkUsername, isLoading } = useMoralisCloudFunction(
    "getIfUsernameValid",
    {
      limit: 1,
    },
    { autoFetch: false }
  );
  const { Moralis, user } = useMoralis();
  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setIsOpen(false);
  };
  const handleNextStep = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  const validateUsername = (username: string) => {
    checkUsername({
      onSuccess: (res) => {
        console.log(res);
        setValidUsername(res as boolean);
      },
      params: {
        username: username,
      },
    });
  };

  const submit = () => {
    setLoading(true);
    userInfo?.set("spectUsername", username);
    userInfo?.set("isInitialized", true);
    user?.set("email", email);
    user?.set("spectUsername", username);
    Moralis.Object.saveAll([user as any, userInfo])
      .then(([user, userInfo]) => {
        dispatch({
          type: "SET_USERINFO",
          value: userInfo,
        });
        setLoading(false);
        setActiveStep(activeStep + 1);
      })
      .catch((err) => {
        alert(err);
        console.log(err);
        setLoading(false);
      });
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
          <ToastContainer />
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
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
          {activeStep === steps.length && (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                Profile initialized succesfully! Please verify your mail to
                start receiving notifications!
              </Typography>
              <Link href={`/profile/${username}`} passHref>
                <Button
                  variant="outlined"
                  endIcon={<ArrowCircleRightIcon />}
                  onClick={(evt) => handleClose(evt, "success")}
                >
                  Go to your profile!
                </Button>
              </Link>
            </React.Fragment>
          )}
          {activeStep === 0 && (
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <TextField
                  autoFocus
                  onChange={(evt) => {
                    setUsername(evt.target.value);
                    validateUsername(evt.target.value);
                  }}
                  margin="dense"
                  id="username"
                  label="Username"
                  fullWidth
                  variant="standard"
                  value={username}
                  error={!validUsername}
                  helperText={
                    validUsername
                      ? "This will be your username on the platform"
                      : "Username already exists please choose another name"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  onChange={(evt) => {
                    setEmail(evt.target.value);
                    setvalidEmail(validateEmail(evt.target.value));
                  }}
                  margin="dense"
                  id="email"
                  label="Email"
                  type={"email"}
                  fullWidth
                  variant="standard"
                  value={email}
                  error={!validEmail}
                  helperText={
                    validEmail
                      ? "This will the email where we send notifications"
                      : "Invalid Email"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="mx-2 my-4">
                  <Button
                    fullWidth
                    variant="outlined"
                    type="submit"
                    disabled={
                      isLoading ||
                      !validUsername ||
                      !validEmail ||
                      !username ||
                      !email
                    }
                    onClick={handleNextStep}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </React.Fragment>
          )}
          {activeStep === 1 && (
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <TextField
                  margin="dense"
                  id="username"
                  label="Username"
                  fullWidth
                  value={username}
                  variant="filled"
                  helperText={"This will be your username on the platform"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type={"email"}
                  value={username}
                  fullWidth
                  variant="filled"
                  helperText={"This will the email where we send notifications"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="mx-2 my-4">
                  <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                    Are you sure you want to proceed? You cannot change your
                    username again!
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      variant="outlined"
                      onClick={handleBack}
                      sx={{ mr: 1, color: "#f45151" }}
                      endIcon={<ArrowBackIcon />}
                      fullWidth
                    >
                      Go back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />

                    <Button
                      fullWidth
                      variant="outlined"
                      type="submit"
                      disabled={
                        isLoading ||
                        !validUsername ||
                        !validEmail ||
                        !username ||
                        !email
                      }
                      onClick={() => submit()}
                    >
                      Hell Yeah
                    </Button>
                  </Box>
                </div>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};
export default InitUserModal;
