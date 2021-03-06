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
} from "@mui/material";
import {
  formStep,
  gigHelperTexts,
  skillOptions,
} from "app/constants/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
import dayjs from "dayjs";
import Editor from "app/components/elements/richTextEditor/editor";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { useEffect, useState } from "react";
import ConfirmModal from "./confirmModal";
import { LightTooltip } from "app/components/elements/styledComponents";

interface Props {}

export interface IGigFormInput {
  name: string;
  skills: Array<{ label: string }>;
  description: any; // fix
  reward: number;
  minStake: number;
  deadline: any;
  acceptanceDays: number;
  revisions: number;
  timeToRevise: number;
}
export const GigForm: React.FC<Props> = (props: Props) => {
  const { handleSubmit, control } = useForm<IGigFormInput>();

  const onError: SubmitErrorHandler<IGigFormInput> = () => handleClickOpen();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<IGigFormInput>({} as IGigFormInput);

  const onSubmit: SubmitHandler<IGigFormInput> = async (values) => {
    setValues(values);
    setIsOpen(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateDate = (date: dayjs.Dayjs) => {
    return date >= dayjs().add(1, "day").startOf("day");
  };
  return (
    <div className="flex flex-col col-span-5 border-grey-normal border-l px-12">
      {isOpen && (
        <ConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} values={values} />
      )}
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
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["name"]}
                >
                  <TextField
                    {...field}
                    label="Gig Name"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "minLength" &&
                      "Gig title too short. Please make it more understandable."
                    }
                    fullWidth
                    required
                    error={fieldState.error ? true : false}
                    id="tGigName"
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
                  placeholder={"Write a thorough description of the gig"}
                  id="tGigDescription"
                />
              )}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["skills"]}
                >
                  <Autocomplete
                    multiple
                    id="tGigSkills"
                    options={skillOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, data) => field.onChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Required Skills"
                      />
                    )}
                  />
                </LightTooltip>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-blue-lighter pb-4 mb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="reward"
              control={control}
              rules={{ min: formStep }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["reward"]}
                >
                  <TextField
                    {...field}
                    label="Reward"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "min" &&
                      "Gig reward shoudl atleast be 1 WMatic"
                    }
                    type="number"
                    required
                    error={fieldState.error ? true : false}
                    inputProps={{ min: 0, step: formStep }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">WMatic</InputAdornment>
                      ),
                    }}
                    fullWidth
                    id="tGigReward"
                  />
                </LightTooltip>
              )}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Controller
              name="minStake"
              control={control}
              rules={{ min: formStep }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["minStake"]}
                >
                  <TextField
                    {...field}
                    label="Minimum Collateral Required"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "min" &&
                      "Gig collateral should atleast be 1 WMatic"
                    }
                    type="number"
                    required
                    error={fieldState.error ? true : false}
                    inputProps={{ min: 0, step: formStep }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">WMatic</InputAdornment>
                      ),
                    }}
                    fullWidth
                    id="tGigStake"
                  />
                </LightTooltip>
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
                defaultValue={dayjs().add(1, "day").startOf("day")}
                rules={{ validate: validateDate }}
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
                        title={gigHelperTexts["deadline"]}
                      >
                        <TextField
                          {...params}
                          fullWidth
                          helperText={
                            params.error && "Enter a date later than now"
                          }
                          id="tGigDeadline"
                        />
                      </LightTooltip>
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
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["acceptanceDays"]}
                >
                  <TextField
                    {...field}
                    label="Time to Accept Work"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "min" &&
                      "Time to accept days should atleast be 1 day"
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
                    id="tGigAcceptance"
                  />
                </LightTooltip>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-blue-lighter pb-4 mb-4">
          <div className="w-1/3 mb-4">
            <Controller
              name="revisions"
              control={control}
              rules={{ max: 10 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["revisions"]}
                >
                  <TextField
                    {...field}
                    label="Revisions"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "max" &&
                      "You cannot request for more than 10 revisions"
                    }
                    type="number"
                    required
                    error={fieldState.error ? true : false}
                    inputProps={{ min: 0, max: 10, step: 1 }}
                    fullWidth
                    id="tGigRevisions"
                  />
                </LightTooltip>
              )}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Controller
              name="timeToRevise"
              control={control}
              rules={{ min: 1 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={gigHelperTexts["timeToRevise"]}
                >
                  <TextField
                    {...field}
                    label="Time to give for revision"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "min" && "Minimum is 1 day"
                    }
                    type="number"
                    error={fieldState.error ? true : false}
                    inputProps={{ min: 1, step: 1 }}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">Days</InputAdornment>
                      ),
                    }}
                    fullWidth
                    id="tGigTimeToRevise"
                  />
                </LightTooltip>
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
            id="bCreateGig"
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
