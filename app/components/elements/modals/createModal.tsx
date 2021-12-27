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
import { create } from "react-modal-promise";
import { approve, listBounty, wrapMatic } from "app/utils/contracts";
import { updateUserStake, useGlobal } from "app/context/web3Context";
import { IGigFormInput } from "app/components/modules/gigForm/gigForm";
import { toIPFS } from "app/utils/moralis";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { ToastContainer, toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Link from "next/link";

interface props {
  isOpen: any;
  onResolve: any;
  onReject: any;
  values: IGigFormInput;
  createGig: Boolean;
}

const gigSteps = ["Approve", "Wrap enough Matic", "Confirm Gig"];
const proposalSteps = [
  "Approve",
  "Wrap enough Matic",
  "Deposit WMatic for collateral",
  "Confirm Gig",
];

const FormModal = ({
  isOpen,
  onResolve,
  onReject,
  values,
  createGig,
}: props) => {
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
  const [steps, setSteps] = useState<Array<string>>([]);
  const { Moralis, user } = useMoralis();

  useEffect(() => {
    updateUserStake(dispatch, user, contracts);
    createGig ? setSteps(gigSteps) : setSteps(proposalSteps);
    if (createGig) {
      values.reward =
        parseFloat(values.reward.toString()) +
        parseFloat((0.02 * values.reward).toString());

      if (userStake?.balance !== undefined) {
        if (!userStake.allowance) {
          setActiveStep(0);
        }
        if (values.reward > userStake?.balance) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
        setRequired(values.reward - userStake?.balance);
        setAmount(values.reward - userStake?.balance);
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

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "48rem",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal open={isOpen} onClose={onReject}>
      <Box sx={style}>
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
              Gig created succesfully! You cannot edit it now, delist it if you
              wish to make changes or to get your escrow back!
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <a
                href={`https://mumbai.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button sx={{ textTransform: "none" }}>View transaction</Button>
              </a>
              <Link href={`/gig/${dealId}`} passHref>
                <Button sx={{ textTransform: "none" }}>Go to gig!</Button>
              </Link>
            </Box>
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
              <Typography sx={{ my: 4, color: "#eaeaea" }}>
                You need to approve our contract to spend your Wrapped Matic
                (WMatic) to proceed.
              </Typography>
              <Button
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  approve(
                    contracts?.tokenContract,
                    contracts?.userContract.address
                  )
                    .then((res) => {
                      dispatch({
                        type: "SET_ALLOWANCE",
                        value: true,
                      });
                      setLoading(false);
                      setActiveStep(1);
                    })
                    .catch((err) => {
                      setLoading(false);
                      alert(err.message);
                    });
                }}
                variant="outlined"
                disabled={amount > balance}
              >
                Approve
              </Button>
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
              <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
                You need to have {required} more Wrapped Matic(WMatic) to
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
                  value={balance}
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
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={onReject}
                sx={{ mr: 1, color: "#f45151" }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  wrapMatic(contracts?.tokenContract, amount)
                    .then((res) => {
                      contracts?.tokenContract
                        .balanceOf(user?.get("ethAddress"))
                        .then((res) => {
                          dispatch({
                            type: "SET_BALANCE",
                            value: parseFloat(ethers.utils.formatEther(res)),
                          });
                        });

                      setLoading(false);
                      setActiveStep(2);
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
                Next
              </Button>
            </Box>
          </React.Fragment>
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
                onClick={onReject}
                sx={{ mr: 1, color: "#f45151" }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setLoaderText("Waiting for the transaction to complete");
                  setLoading(true);
                  wrapMatic(contracts?.tokenContract, amount)
                    .then((res) => {
                      contracts?.tokenContract
                        .balanceOf(user?.get("ethAddress"))
                        .then((res) => {
                          dispatch({
                            type: "SET_BALANCE",
                            value: parseFloat(ethers.utils.formatEther(res)),
                          });
                        });

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
                Next
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
                Are you sure you want to create the gig? {values.reward} WMatic
                will be escrowed from your wallet.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                onClick={onReject}
                sx={{ mr: 1, color: "#f45151" }}
              >
                Nevermind
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={() => {
                  setLoaderText("Uploading metatdata on IPFS please wait....");
                  setLoading(true);
                  let tags: Array<string> = [];
                  values.skills?.filter((a) => tags.push(a.label));
                  toIPFS("object", {
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
                variant="outlined"
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
export const CreateModal = create(FormModal as any) as any;
