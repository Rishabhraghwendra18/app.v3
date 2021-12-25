import {
  useForm,
  SubmitHandler,
  Controller,
  ControllerFieldState,
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
  Snackbar,
  Alert,
} from "@mui/material";
import { gigHelperTexts, skillOptions } from "app/constants/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
import dayjs from "dayjs";
import Editor from "app/components/elements/richTextEditor/editor";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { useState } from "react";
import { ConfirmModal } from "app/components/elements/modals/confirmModal";
import ModalContainer from "react-modal-promise";
import { toIPFS } from "app/utils/moralis";
import { listBounty } from "app/utils/contracts";
import { useWeb3 } from "app/context/web3Context";

interface Props {}

interface IGigFormInput {
  name: string;
  skills: Array<{ value: string }>;
  description: any; // fix
  reward: number;
  minStake: number;
  deadline: any;
  acceptanceDays: number;
}
export const GigForm: React.FC<Props> = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IGigFormInput>();

  const { state } = useWeb3();
  const onError: SubmitErrorHandler<IGigFormInput> = () => handleClickOpen();
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IGigFormInput> = async (data) => {
    console.log(data);
    const confirmed = await ConfirmModal({
      text: `Are you sure you want to create this gig. ${data.reward} WMatic will be escrowed from your wallet!`,
    });
    if (confirmed) {
      setLoading(true);
      toIPFS("object", {
        name: data.name,
        skills: data.skills,
        description: data.description,
        minStake: data.minStake,
        deadline: data.deadline.toDate().toUTCString(),
      }).then((res) => {
        console.log(res);
        const ipfsUrlArray = res.path.split("/");
        listBounty(
          state.contracts?.dealContract,
          data.reward,
          data.acceptanceDays,
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
            console.log(dealId);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            alert(err.data.message);
          });
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col col-span-5 border-grey-normal border-l px-12">
      <ModalContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col"
      >
        <div className="flex flex-col border-b-1 border-blue-lighter pb-4 mb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ minLength: 5 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Gig Name"
                  variant="standard"
                  helperText={
                    fieldState.error
                      ? fieldState.error?.type === "minLength"
                        ? "Gig name needs to be atleast 5 characters"
                        : "Error"
                      : gigHelperTexts["name"]
                  }
                  fullWidth
                  required
                  error={fieldState.error ? true : false}
                />
              )}
            />
          </div>
          <div className="w-2/3 mb-4">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={skillOptions}
                  getOptionLabel={(option) => option.label}
                  onChange={(e, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Required Skills"
                      helperText="Skills the freelancer would need to have to complete the
                          gig successfully."
                    />
                  )}
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-blue-lighter pb-4 mb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="reward"
              control={control}
              rules={{ min: 1 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Reward"
                  variant="standard"
                  helperText={
                    fieldState.error
                      ? fieldState.error?.type === "min"
                        ? "Gig reward needs to be atleast 1 WMatic"
                        : "Error"
                      : gigHelperTexts["reward"]
                  }
                  type="number"
                  required
                  error={fieldState.error ? true : false}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">WMatic</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Controller
              name="minStake"
              control={control}
              rules={{ min: 1 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Minimum Collateral Required"
                  variant="standard"
                  helperText={
                    fieldState.error
                      ? fieldState.error?.type === "min"
                        ? "Gig collateral needs to be atleast 1 WMatic"
                        : "Error"
                      : gigHelperTexts["minStake"]
                  }
                  type="number"
                  required
                  error={fieldState.error ? true : false}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">WMatic</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-blue-lighter pb-4 mb-4">
          <LocalizationProvider dateAdapter={DateAdapter}>
            <div className="w-1/3 mb-4">
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label="Deadline"
                    minDateTime={dayjs()}
                    onChange={field.onChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        helperText={
                          params.error
                            ? "Enter a date later than now"
                            : gigHelperTexts["deadline"]
                        }
                      />
                    )}
                  />
                )}
              />
            </div>
          </LocalizationProvider>

          <div className="w-1/3 mb-4">
            <Controller
              name="acceptanceDays"
              control={control}
              rules={{ min: 1 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Time to Accept Work"
                  variant="standard"
                  helperText={
                    fieldState.error
                      ? fieldState.error?.type === "min"
                        ? "Time to accept days should atleast be 1 day"
                        : "Error"
                      : gigHelperTexts["acceptanceDays"]
                  }
                  type="number"
                  required
                  error={fieldState.error ? true : false}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">Days</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </div>
        </div>

        <div className="w-1/3 my-4">
          <PrimaryButton
            variant="outlined"
            size="large"
            fullWidth
            type="submit"
            endIcon={<AssignmentTurnedInIcon />}
          >
            Create Gig
          </PrimaryButton>
        </div>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Form validation errors"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please fix the form validation errors and submit again
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
