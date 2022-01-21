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
  callDispute,
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
import { toIPFS } from "app/utils/moralis";
import { modules } from "app/constants/constants";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const steps = ["Wrap enough Matic", "Deposit collateral", "Raise Dispute"];

const DisputeModal = ({ isOpen, setIsOpen }: props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [required, setRequired] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loaderText, setLoaderText] = useState("");
  const [disputeText, setDisputeText] = useState("");
  const [hash, setHash] = useState("");

  const {
    state: { contracts, userStake },
    dispatch,
  } = useGlobal();

  const { gig } = useGig();
  const { Moralis, user } = useMoralis();

  const handleClose = () => setIsOpen(false);

  const handleNextStep = () => setActiveStep(activeStep + 1);

  useEffect(() => {
    // updateUserStake(dispatch, user, contracts);
    const unlockedDeposit =
      (userStake?.deposit || 0) - (userStake?.collateral || 0);
    if (gig.proposal[0].lockedStake > unlockedDeposit) {
      if (
        gig.proposal[0].lockedStake - unlockedDeposit >
        (userStake?.balance || 0)
      ) {
        setActiveStep(0);
        setRequired(
          gig.proposal[0].lockedStake -
            unlockedDeposit -
            (userStake?.balance || 0)
        );
        setAmount(
          gig.proposal[0].lockedStake -
            unlockedDeposit -
            (userStake?.balance || 0)
        );
      } else {
        setActiveStep(1);
        setRequired(gig.proposal[0].lockedStake - unlockedDeposit);
        setAmount(gig.proposal[0].lockedStake - unlockedDeposit);
      }
    } else {
      setActiveStep(2);
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
    overflow: "auto",
    maxHeight: "90%",
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
              Dispute raised succesfully!. We will get back to you with the
              results!.
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
                  pathname: `/gig/${gig.dealId}`,
                  query: {
                    tab: 6,
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
        )}
        {activeStep === 0 && (
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
        {activeStep === 1 && (
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
              <div className="mt-4 text-grey-light">
                <ReactQuill
                  onChange={(value, delta, user, editor) => {
                    setDisputeText(editor.getContents() as any);
                  }}
                  theme="snow"
                  modules={modules}
                  defaultValue={disputeText}
                  placeholder={"Describe the dispute in detail"}
                />
              </div>
              <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                Are you sure you want to raise dispute?{" "}
                {gig.proposal[0].lockedStake} WMatic will be locked from your
                wallet.
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
                  setLoaderText(
                    "Uploading dispute metadata to IPFS, please wait"
                  );
                  setLoading(true);
                  toIPFS(Moralis, "object", {
                    disputeReason: disputeText,
                  }).then((res) => {
                    const ipfsUrlArray = res.path.split("/");
                    setLoaderText("Waiting for the transaction to complete");
                    callDispute(
                      gig.dealId,
                      ipfsUrlArray[ipfsUrlArray.length - 1],
                      contracts?.dealContract
                    )
                      .then((res) => {
                        setHash(res.transactionHash);
                        setLoading(false);
                        setActiveStep(activeStep + 1);
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
                          className: "text-sm text-grey-spect border-blue-500",
                        });
                      });
                  });
                }}
                variant="outlined"
              >
                Raise Dispute
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};
export default DisputeModal;
