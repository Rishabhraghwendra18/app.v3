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
} from "@mui/material";
import { listBounty } from "app/utils/contracts";
import { updateUserStake, useGlobal } from "app/context/globalContext";
import { IGigFormInput } from "app/components/modules/gigForm";
import { toIPFS } from "app/utils/moralis";
import { useMoralis } from "react-moralis";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import ApproveModal from "app/components/elements/modals/approveModal";
import WrapModal from "app/components/elements/modals/wrapModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  values: IGigFormInput;
}

const steps = ["Approve", "Wrap enough Matic", "Confirm Gig"];

const ConfirmModal = ({ isOpen, setIsOpen, values }: props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [required, setRequired] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loaderText, setLoaderText] = useState("");
  const [reward, setReward] = useState(0);
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
    updateUserStake(dispatch, user, contracts);
    const totalReward =
      parseFloat(values.reward.toString()) +
      parseFloat((0.02 * values.reward).toString());
    setReward(totalReward);
    if (userStake?.balance !== undefined) {
      if (!userStake.allowance) {
        setActiveStep(0);
      } else if (totalReward > userStake?.balance) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
      setRequired(totalReward - userStake?.balance);
      setAmount(totalReward - userStake?.balance);
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
  console.log(values.reward);
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
              Gig created succesfully! You cannot edit it now, delist it if you
              wish to make changes or to get your escrow back!
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
            handleClose={handleClose}
            amount={amount}
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
              <Typography sx={{ mt: 2, color: "#eaeaea" }}>
                Are you sure you want to create the gig?
              </Typography>
              <Typography sx={{ color: "#eaeaea" }}>
                {reward.toFixed(3)} WMatic will be escrowed from your wallet.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleClose}
                sx={{ mr: 1, color: "#f45151" }}
                endIcon={<ClearIcon />}
              >
                Nevermind
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                variant="outlined"
                id="bCreateGigConfirm"
                endIcon={<CheckCircleIcon />}
                onClick={() => {
                  setLoaderText("Uploading metatdata on IPFS please wait....");
                  setLoading(true);
                  let tags: Array<string> = [];
                  values.skills?.filter((a) => tags.push(a.label));
                  toIPFS(Moralis, "object", {
                    name: values.name,
                    description: values.description,
                    tags: tags,
                    desiredSubmissionDeadline: values.deadline
                      .toDate()
                      .toUTCString(),
                    desiredCollateral: values.minStake,
                  }).then((res) => {
                    const ipfsUrlArray = res.path.split("/");
                    setLoaderText("Waiting for the transaction to complete");
                    listBounty(
                      contracts?.dealContract,
                      values.reward,
                      values.acceptanceDays,
                      ipfsUrlArray[ipfsUrlArray.length - 1]
                    )
                      .then((res) => {
                        const hash = res.transactionHash;
                        let dealId;
                        for (const event of res.events) {
                          if (event.event && event.event === "ListGig") {
                            dealId = event.args[1];
                          }
                        }
                        setHash(hash);
                        setDealId(dealId);
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
                      });
                  });
                }}
              >
                Create Gig
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Modal>
  );
};
export default ConfirmModal;
