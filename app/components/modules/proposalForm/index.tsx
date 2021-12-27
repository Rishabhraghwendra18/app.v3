import {
  useForm,
  SubmitHandler,
  Controller,
  SubmitErrorHandler,
} from "react-hook-form";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  TextField,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Backdrop,
  CircularProgress,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
  Typography,
  Box,
} from "@mui/material";
import { proposalHelperTexts, skillOptions } from "app/constants/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
import dayjs from "dayjs";
import Editor from "app/components/elements/richTextEditor/editor";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { useState } from "react";
import ModalContainer from "react-modal-promise";
import { useGlobal } from "app/context/web3Context";
import { CreateModal } from "app/components/elements/modals/createModal";
import { useGig } from "pages/gig/[id]";
import { createProposal } from "app/utils/moralis";

interface Props {}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#eaeaea",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: "0.8rem",
    maxWidth: "22rem",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#eaeaea",
  },
}));

export interface IProposalFormInput {
  title: string;
  description: any; // fix
  minStake: number;
  deadline: any;
}
export const ProposalForm: React.FC<Props> = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IProposalFormInput>();

  const { gig } = useGig();

  //   const onError: SubmitErrorHandler<IProposalFormInput> = () =>
  //     handleClickOpen();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<IProposalFormInput>();

  const onSubmit: SubmitHandler<IProposalFormInput> = async (values) => {
    setOpen(true);
    setValues(values);
  };

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="mt-4 p-1">
      <ModalContainer />
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
            Submitting proposal please wait
          </Typography>
        </Box>
      </Backdrop>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col pb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ minLength: 5 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={proposalHelperTexts["title"]}
                >
                  <TextField
                    {...field}
                    label="Proposal Title"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "minLength" &&
                      "Proposal title too short. Please make it more understandable."
                    }
                    fullWidth
                    required
                    error={fieldState.error ? true : false}
                  />
                </LightTooltip>
              )}
            />
          </div>
          <div className="w-2/3 mb-4">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={"Write a thorough description of your proposal"}
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col pb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="minStake"
              control={control}
              rules={{ min: gig.minStake }}
              defaultValue={gig.minStake}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={proposalHelperTexts["minStake"]}
                >
                  <TextField
                    {...field}
                    label="Minimum Collateral Required"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "min" &&
                      "Gig collateral shoudl atleast be 1 WMatic"
                    }
                    type="number"
                    required
                    error={fieldState.error ? true : false}
                    inputProps={{ min: gig.minStake, step: 0.01 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">WMatic</InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </LightTooltip>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <LocalizationProvider dateAdapter={DateAdapter}>
            <div className="w-1/3 mb-4">
              <Controller
                name="deadline"
                control={control}
                defaultValue={dayjs(gig.deadline)}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Deadline"
                    minDateTime={dayjs()}
                    onChange={field.onChange}
                    renderInput={(params) => (
                      <LightTooltip
                        arrow
                        placement="right"
                        title={proposalHelperTexts["deadline"]}
                      >
                        <TextField
                          {...params}
                          fullWidth
                          helperText={
                            params.error && "Enter a date later than now"
                          }
                        />
                      </LightTooltip>
                    )}
                  />
                )}
              />
            </div>
          </LocalizationProvider>
        </div>

        <div className="w-1/3 my-4">
          <PrimaryButton
            variant="outlined"
            size="large"
            fullWidth
            type="submit"
            endIcon={<AssignmentTurnedInIcon />}
          >
            Send Proposal
          </PrimaryButton>
        </div>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to send this proposal?
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Proposals cannot be edited or deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            onClick={handleClose}
            sx={{ mr: 1, color: "#f45151", textTransform: "none" }}
          >
            Nevermind
          </Button>
          <Button
            onClick={() => {
              handleClose();
              setLoading(true);
              createProposal(
                gig.dealId,
                values?.title,
                values?.description,
                values?.minStake,
                new Date(values?.deadline).toUTCString()
              ).then((res) => {
                setLoading(false);
              });
            }}
            autoFocus
            sx={{ mr: 1, textTransform: "none" }}
          >
            Hell Yeah!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
