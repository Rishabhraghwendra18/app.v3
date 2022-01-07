import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import { addToStake } from "app/utils/contracts";
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

const DepositModal = ({
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
          You need to desposit {required} more Wrapped Matic(WMatic) to proceed.
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
              : "You need to deposit matic for collateral"
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
            addToStake(contracts?.userContract, amount)
              .then((res) => {
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
        >
          Deposit
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default DepositModal;
