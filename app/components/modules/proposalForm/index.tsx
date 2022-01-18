import { useForm, SubmitHandler, Controller } from "react-hook-form";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  TextField,
  InputAdornment,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
} from "@mui/material";
import {
  animationVariant,
  formStep,
  proposalHelperTexts,
} from "app/constants/constants";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDayjs";
import dayjs from "dayjs";
import Editor from "app/components/elements/richTextEditor/editor";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import { useEffect, useState } from "react";
import { useGig } from "pages/gig/[id]";
import { motion } from "framer-motion";
import { ConfirmModal } from "./confirmModal";
import { useGlobal } from "app/context/globalContext";
import InitUserModal from "app/components/elements/modals/initUserModal";

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
  const {
    state: { userInfo },
  } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitOpen, setIsInitOpen] = useState(false);
  const [values, setValues] = useState<IProposalFormInput>(
    {} as IProposalFormInput
  );

  const onSubmit: SubmitHandler<IProposalFormInput> = async (values) => {
    setIsOpen(true);
    setValues(values);
  };

  useEffect(() => {
    if (!userInfo?.get("isInitialized")) {
      setIsInitOpen(true);
    }
  }, []);

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="mt-4 p-1">
        {isOpen && (
          <ConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} values={values} />
        )}
        {isInitOpen && (
          <InitUserModal isOpen={isInitOpen} setIsOpen={setIsInitOpen} />
        )}
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
                      id="tProposalTitle"
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
                    placeholder={
                      "Write a thorough description of your proposal"
                    }
                    id="tProposalForm"
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
                      inputProps={{ min: gig.minStake, step: formStep }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            WMatic
                          </InputAdornment>
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

          <div className="w-1/4 my-4">
            <PrimaryButton
              variant="outlined"
              size="large"
              fullWidth
              type="submit"
              endIcon={<AssignmentTurnedInIcon />}
              id="bSendProposal"
            >
              Send Proposal
            </PrimaryButton>
          </div>
        </form>
      </div>
    </motion.main>
  );
};
