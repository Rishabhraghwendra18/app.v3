import { Box, Button, Typography } from "@mui/material";
import { useGlobal } from "app/context/globalContext";
import { approve } from "app/utils/contracts";
import React from "react";

interface Props {
  setLoaderText: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  amount: number;
  balance: number;
  handleClose: Function;
}

const ApproveModal = ({
  setLoaderText,
  setLoading,
  setActiveStep,
  amount,
  balance,
  handleClose,
}: Props) => {
  const {
    state: { contracts, userStake },
    dispatch,
  } = useGlobal();
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography sx={{ my: 4, color: "#eaeaea" }}>
          You need to approve our contract to spend your Wrapped Matic (WMatic)
          to proceed.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => handleClose()}
            sx={{ mr: 1, color: "#f45151" }}
            id="bCancel"
          >
            Cancel
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            onClick={() => {
              setLoaderText("Waiting for the transaction to complete");
              setLoading(true);
              approve(contracts?.tokenContract, contracts?.userContract.address)
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
            id="bApprove"
          >
            Approve
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default ApproveModal;
