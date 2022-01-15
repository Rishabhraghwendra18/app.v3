import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import { wrapMatic } from "app/utils/contracts";
import { ethers } from "ethers";
import { toast } from "material-react-toastify";
import React from "react";
import { useMoralis } from "react-moralis";

interface Props {
  setLoaderText: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleNextStep: () => void;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  balance: number;
  required: number;
  handleClose: Function;
}

const WrapModal = ({
  setLoaderText,
  setLoading,
  handleNextStep,
  amount,
  setAmount,
  balance,
  required,
  handleClose,
}: Props) => {
  const {
    state: { contracts, userStake },
    dispatch,
  } = useGlobal();
  const { user } = useMoralis();
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography sx={{ mt: 2, mb: 1, color: "#eaeaea" }}>
          You need to have {required} more Wrapped Matic(WMatic) to proceed.
        </Typography>
        <TextField
          autoFocus
          value={amount}
          onChange={(evt) => setAmount(parseFloat(evt.target.value))}
          margin="dense"
          id="tAmount"
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
          // inputProps={{ step: 0.1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">Matic</InputAdornment>,
          }}
        />
        <div className="w-1/3 my-2">
          <TextField
            value={balance}
            margin="dense"
            id="tBalance"
            label="Available Balance"
            type="number"
            fullWidth
            variant="filled"
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
          variant="outlined"
          onClick={() => handleClose()}
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
                handleNextStep();
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
          id="bWrap"
        >
          Wrap
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default WrapModal;
