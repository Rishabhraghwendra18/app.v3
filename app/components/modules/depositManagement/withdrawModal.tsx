import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fade,
  InputAdornment,
  Modal,
  Slider,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { toast, ToastContainer } from "material-react-toastify";
import { removeStake, unWrapMatic } from "app/utils/contracts";
import { ethers } from "ethers";
import { useGlobal } from "app/context/globalContext";
import { useMoralis } from "react-moralis";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import WrapTextIcon from "@mui/icons-material/WrapText";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface Props {
  step: number;
}
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const steps = ["Withdraw", "Unwrap Matic"];

const WithdrawModal = ({ step }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loaderText, setLoaderText] = useState("Updating metadata");
  const [loading, setLoading] = useState(false);
  const [maticBalance, setMaticBalance] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [unlockedBalance, setUnlockedBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const {
    state: { contracts, userStake },
    dispatch,
  } = useGlobal();
  const handleClose = () => setIsOpen(false);
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleSliderChange = (evt, value) => {
    if (activeStep === 0) {
      setAmount((value * unlockedBalance) / 100);
    } else {
      setAmount((value * (userStake?.balance || 0)) / 100);
    }
  };

  const { user } = useMoralis();

  useEffect(() => {
    setActiveStep(step);
    setUnlockedBalance(
      (userStake?.deposit || 0) - (userStake?.collateral || 0)
    );
  }, []);

  return (
    <div className="w-full">
      {step == 1 ? (
        <PrimaryButton
          variant="outlined"
          endIcon={<WrapTextIcon />}
          fullWidth
          sx={{ mx: 2 }}
          onClick={() => {
            setActiveStep(1);
            setIsOpen(true);
          }}
        >
          Unwrap Matic
        </PrimaryButton>
      ) : (
        <PrimaryButton
          variant="contained"
          endIcon={<AccountBalanceIcon />}
          fullWidth
          onClick={() => {
            setActiveStep(0);
            setIsOpen(true);
          }}
        >
          Withdraw
        </PrimaryButton>
      )}
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
            <ToastContainer />
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
                    value={amount}
                    onChange={(evt) => setAmount(parseFloat(evt.target.value))}
                    margin="dense"
                    id="name"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="standard"
                    error={amount > unlockedBalance}
                    helperText={
                      amount > unlockedBalance
                        ? "Not enough unlocked deposit available"
                        : "You can withdraw your deposited WMatic"
                    }
                    inputProps={{ step: 0.1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Matic</InputAdornment>
                      ),
                    }}
                  />
                  <div className="w-2/3 my-2">
                    <TextField
                      value={unlockedBalance}
                      margin="dense"
                      id="name"
                      label="Available Balance"
                      type="number"
                      fullWidth
                      variant="standard"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Matic</InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                  </div>
                  <Slider
                    defaultValue={0}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: "0%" },
                      { value: 25, label: "25%" },
                      { value: 50, label: "50%" },
                      { value: 75, label: "75%" },
                      { value: 100, label: "100%" },
                    ]}
                    onChange={handleSliderChange}
                  />
                </Box>
                <div className="mx-2 my-4">
                  <Button
                    fullWidth
                    onClick={() => {
                      setLoaderText("Waiting for the transaction to complete");
                      setLoading(true);
                      removeStake(contracts?.userContract, amount)
                        .then(async (res) => {
                          const deposit =
                            await contracts?.userContract.getDeposit(
                              user?.get("ethAddress")
                            );
                          const balance =
                            await contracts?.tokenContract.balanceOf(
                              user?.get("ethAddress")
                            );
                          dispatch({
                            type: "SET_DEPOSIT",
                            value: parseFloat(
                              ethers.utils.formatEther(deposit)
                            ),
                          });
                          dispatch({
                            type: "SET_BALANCE",
                            value: parseFloat(
                              ethers.utils.formatEther(balance)
                            ),
                          });
                          setLoading(false);
                          handleNext();
                        })
                        .catch((err) => {
                          setLoading(false);
                          toast.error(err.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            className:
                              "text-sm text-grey-spect border-blue-500",
                          });
                        });
                    }}
                    variant="outlined"
                    disabled={amount > unlockedBalance}
                  >
                    Withdraw
                  </Button>
                </div>
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
                    autoFocus
                    value={amount}
                    onChange={(evt) => setAmount(parseFloat(evt.target.value))}
                    margin="dense"
                    id="name"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="standard"
                    error={amount > (userStake?.balance || 0)}
                    helperText={
                      amount > (userStake?.balance || 0)
                        ? "Not enough WMatic available"
                        : "You can unwrap matic to get back matic"
                    }
                    inputProps={{ step: 0.1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">WMatic</InputAdornment>
                      ),
                    }}
                  />
                  <div className="w-2/3 my-2">
                    <TextField
                      value={userStake?.balance}
                      margin="dense"
                      id="name"
                      label="Available Balance"
                      type="number"
                      fullWidth
                      variant="standard"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">WMatic</InputAdornment>
                        ),
                        readOnly: true,
                      }}
                    />
                  </div>
                  <Slider
                    defaultValue={0}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: "0%" },
                      { value: 25, label: "25%" },
                      { value: 50, label: "50%" },
                      { value: 75, label: "75%" },
                      { value: 100, label: "100%" },
                    ]}
                    onChange={handleSliderChange}
                  />
                </Box>
                <div className="mx-2 my-4">
                  <Button
                    fullWidth
                    onClick={() => {
                      setLoaderText("Waiting for the transaction to complete");
                      setLoading(true);
                      unWrapMatic(contracts?.tokenContract, amount)
                        .then((res) => {
                          contracts?.tokenContract
                            .balanceOf(user?.get("ethAddress"))
                            .then((res) => {
                              dispatch({
                                type: "SET_BALANCE",
                                value: parseFloat(
                                  ethers.utils.formatEther(res)
                                ),
                              });
                            });

                          setLoading(false);
                          handleNext();
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
                          console.log(err);
                        });
                    }}
                    variant="outlined"
                    disabled={amount > (userStake?.balance || 0)}
                  >
                    Unwrap
                  </Button>
                </div>
              </React.Fragment>
            )}
            {activeStep === steps.length && (
              <React.Fragment>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Typography color="primary" sx={{ m: 4 }}>
                    Unwrap Complete!
                  </Typography>
                </Box>
              </React.Fragment>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleClose}
                sx={{ mr: 1, color: "#f45151" }}
                endIcon={<ClearIcon />}
              >
                Exit
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default WithdrawModal;
