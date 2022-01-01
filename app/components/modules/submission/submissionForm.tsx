import { Button, TextField } from "@mui/material";
import {
  Controller,
  SubmitHandler,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { submissionHelperTexts } from "app/constants/constants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { LightTooltip } from "app/components/elements/styledComponents";
import Editor from "app/components/elements/richTextEditor/editor";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useState } from "react";
import { ConfirmModal } from "./confirmModal";
import { useGig } from "pages/gig/[id]";

interface Props {}
export interface ISubmissionFormInput {
  comments: any; // fix
  links: {
    name: string;
    link: string;
  }[];
  file: File;
}

const FileInput = ({ control, name }) => {
  const { field } = useController({ control, name });
  const [value, setValue] = useState("");
  return (
    <LightTooltip
      arrow
      placement="bottom"
      title={submissionHelperTexts["file"]}
    >
      <Button
        variant="contained"
        component="label"
        fullWidth
        sx={{ textTransform: "none" }}
      >
        {field.value?.name || "Upload File"}
        <input
          type="file"
          hidden
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            field.onChange(e.target.files ? e.target.files[0] : null);
          }}
        />
      </Button>
    </LightTooltip>
  );
};

const SubmissionForm = (props: Props) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<ISubmissionFormInput>();

  const { fields, append, remove } = useFieldArray({
    name: "links",
    control,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<ISubmissionFormInput>(
    {} as ISubmissionFormInput
  );
  const { gig } = useGig();

  const onSubmit: SubmitHandler<ISubmissionFormInput> = async (values) => {
    setValues(values);
    setIsOpen(true);
  };

  return (
    <div>
      {isOpen && (
        <ConfirmModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          values={values}
          confirmText1="Are you sure you want to send this submission?"
          confirmText2="This submission will be considered final and you cannot edit it!"
          finishText1="Submission sent succesfully!"
          finishText2={`Client will review your submission now and get back to you
                within ${gig.timeToAcceptInDays} day(s).`}
          confirmType={1}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col my-8">
          <span className="text-blue-bright font-bold w-1/2 mb-4">
            Submission 01
          </span>
          <div>
            <Button
              sx={{ color: "#99ccff" }}
              color="inherit"
              endIcon={<AddCircleOutlineIcon />}
              onClick={() => append({ name: "", link: "" })}
            >
              Add Link
            </Button>
          </div>
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <section className={"section"} key={field.id}>
                  <div className="flex flex row w-1/2 py-1">
                    <div className="px-2 w-full">
                      <Controller
                        name={`links.${index}.name`}
                        control={control}
                        rules={{ minLength: 3 }}
                        render={({ field, fieldState }) => (
                          <LightTooltip
                            arrow
                            placement="bottom"
                            title={submissionHelperTexts["name"]}
                          >
                            <TextField
                              {...field}
                              label="Name"
                              variant="standard"
                              helperText={
                                fieldState.error?.type === "minLength" &&
                                "Link name too short. Please make it more understandable."
                              }
                              fullWidth
                              required
                              error={fieldState.error ? true : false}
                            />
                          </LightTooltip>
                        )}
                      />
                    </div>
                    <div className="px-2 w-full">
                      <Controller
                        name={`links.${index}.link`}
                        control={control}
                        rules={{
                          pattern:
                            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                        }}
                        render={({ field, fieldState }) => (
                          <LightTooltip
                            arrow
                            placement="bottom"
                            title={submissionHelperTexts["link"]}
                          >
                            <TextField
                              {...field}
                              label="Link"
                              variant="standard"
                              helperText={
                                fieldState.error?.type === "pattern" &&
                                "Wrong URL format. Please provide the correct URL."
                              }
                              fullWidth
                              required
                              error={fieldState.error ? true : false}
                            />
                          </LightTooltip>
                        )}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ mr: 1, color: "#f45151", textTransform: "none" }}
                        endIcon={<DeleteOutlineIcon />}
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            );
          })}
          <div className="my-4 w-1/2">
            <Controller
              name="comments"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Editor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      "Write comments describing your submission and any instructions if needed"
                    }
                  />
                </div>
              )}
            />
          </div>
          <div className="my-4 w-1/5">
            <FileInput name="file" control={control} />
          </div>

          <div className="w-1/4 my-4">
            <PrimaryButton
              variant="outlined"
              size="large"
              fullWidth
              type="submit"
              endIcon={<AssignmentTurnedInIcon />}
            >
              Submit Work
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
