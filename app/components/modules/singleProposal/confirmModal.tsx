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
import { updateUserStake, useGlobal } from "app/context/globalContext";
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
import { useGig } from "pages/gig/[id]";
import DepositModal from "app/components/elements/modals/despositModal";

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

  const handleNextStep = () => setActiveStep(activeStep + 1);

  useEffect(() => {
    // updateUserStake(dispatch, user, contracts);
    const unlockedDeposit =
      (userStake?.deposit || 0) - (userStake?.collateral || 0);
    if (userStake?.balance !== undefined) {
      if (!userStake.allowance) {
        setActiveStep(0);
      } else if (proposal.lockedStake > unlockedDeposit) {
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
        chain: process.env.NETWORK_CHAIN as any,
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
            <CircularProgress color="inherit" id="eLoader" />
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
                  pathname: `/gig/${proposal.dealId}`,
                  query: {
                    tab: 5,
                  },
                }}
                as={`/gig/${proposal.dealId}`}
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
            handleNextStep={handleNextStep}
            balance={balance}
            amount={amount}
            setAmount={setAmount}
            required={required}
            handleClose={handleClose}
          />
        )}
        {activeStep === 2 && (
          <DepositModal
            setLoaderText={setLoaderText}
            setLoading={setLoading}
            handleNextStep={handleNextStep}
            balance={balance}
            amount={amount}
            setAmount={setAmount}
            required={required}
            handleClose={handleClose}
          />
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
                id="bConfirm"
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
                Hell Yeah!
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};
export default ConfirmModal;
