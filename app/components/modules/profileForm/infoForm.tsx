import { Autocomplete, TextField } from "@mui/material";
import { LightTooltip } from "app/components/elements/styledComponents";
import { gigHelperTexts, skillOptions } from "app/constants/constants";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {}

export interface IInfoFormInput {
  name: string;
  username: string;
  email: string;
  skills: Array<{ label: string }>;
  designation: string;
}

const InfoForm = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IInfoFormInput>();
  return (
    <div className="ml-4 mr-32">
      <div className="my-2">
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
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="my-2">
        <Controller
          name="username"
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
                label="Username"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="my-2">
        <Controller
          name="email"
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
                label="Email"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="my-2">
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
                id="tags-standard"
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
      <div className="my-2">
        <Controller
          name="designation"
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
                label="Title/ Designation"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
              />
            </LightTooltip>
          )}
        />
      </div>
    </div>
  );
};

export default InfoForm;
