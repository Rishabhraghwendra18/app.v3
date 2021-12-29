import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  addToStake,
  listBounty,
  secondConfirmation,
  wrapMatic,
} from "app/utils/contracts";
import { updateUserStake, useGlobal } from "app/context/web3Context";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import ApproveModal from "app/components/elements/modals/approveModal";
import WrapModal from "app/components/elements/modals/wrapModal";
import { Proposal } from "app/types";
import { formatTimeLeft } from "app/utils/utils";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  proposal: Proposal;
}

const steps = [
  "Approve",
  "Wrap enough Matic",
  "Deposit collateral",
  "Start Work",
];

const ConfirmModal = ({ isOpen, setIsOpen, proposal }: props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [required, setRequired] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loaderText, setLoaderText] = useState("");
  const {
    state: { contracts, userStake },
    dispatch,
  } = useGlobal();
  const [hash, setHash] = useState("");
  const [dealId, setDealId] = useState(0);
  const { Moralis, user } = useMoralis();

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    updateUserStake(dispatch, user, contracts);
    if (userStake?.balance !== undefined) {
      if (!userStake.allowance) {
        setActiveStep(0);
      }
      const unlockedDeposit =
        (userStake?.deposit || 0) - (userStake?.collateral || 0);
      if (proposal.lockedStake > unlockedDeposit) {
        if (proposal.lockedStake - unlockedDeposit > userStake.balance) {
          setActiveStep(1);
          setRequired(
            proposal.lockedStake - unlockedDeposit - userStake.balance
          );
          setAmount(proposal.lockedStake - unlockedDeposit - userStake.balance);
        } else {
          setActiveStep(2);
          setRequired(proposal.lockedStake - unlockedDeposit);
          setAmount(proposal.lockedStake - unlockedDeposit);
        }
      } else {
        setActiveStep(3);
      }
    }
    Moralis.Web3API.account
      .getNativeBalance({
        chain: "mumbai",
        address: user?.get("ethAddress"),
      })
      .then((res) => {
        setBalance(parseInt(res.balance) / 10 ** 18);
      });
  }, []);

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
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
        {activeStep === steps.length && (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
              Work Started succesfully!. You have{" "}
              {formatTimeLeft(proposal.deadline)} left to submit work.
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
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
              <Link href={`/gig/${dealId}`} passHref>
                <Button variant="outlined" endIcon={<ArrowCircleRightIcon />}>
                  Go to gig!
                </Button>
              </Link>
            </Box>
          </React.Fragment>
        )}
        {activeStep === 0 && (
          <ApproveModal
            setLoaderText={setLoaderText}
            setLoading={setLoading}
            setActiveStep={setActiveStep}
            balance={balance}
            amount={amount}
            handleClose={handleClose}
          />
        )}
        {activeStep === 1 && (
          <WrapModal
            setLoaderText={setLoaderText}
            setLoading={setLoading}
            setActiveStep={setActiveStep}
            balance={balance}
            amount={amount}
            setAmount={setAmount}
            required={required}
            handleClose={handleClose}
          />
        )}
        {activeStep === 2 && (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                You need to desposit {required} more Wrapped Matic(WMatic) to
                proceed.
              </Typography>
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
                error={amount > balance}
                helperText={
                  amount > balance
                    ? "Not enough Matic available"
                    : "You need to wrap matic so it can be used in our platform"
                }
                inputProps={{ step: 0.1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">WMatic</InputAdornment>
                  ),
                }}
              />
              <div className="w-1/3 my-2">
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
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={handleClose}
                sx={{ mr: 1, color: "#f45151" }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  addToStake(contracts?.userContract, amount)
                    .then((res) => {
                      setLoading(false);
                      setActiveStep(3);
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
                disabled={amount > balance}
              >
                Deposit
              </Button>
            </Box>
          </React.Fragment>
        )}
        {activeStep === steps.length - 1 && (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                Are you sure you want to start work? {proposal.lockedStake}{" "}
                WMatic will be locked from your wallet.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={handleClose}
                sx={{ mr: 1, color: "#f45151" }}
              >
                Nevermind
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  secondConfirmation(proposal.dealId, contracts?.dealContract)
                    .then((res) => {
                      const hash = res.transactionHash;
                      setHash(hash);
                      setLoading(false);
                      setActiveStep(4);
                    })
                    .catch((err) => {
                      setLoading(false);
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
                    });
                }}
                variant="outlined"
              >
                Start Work
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};
export default ConfirmModal;
