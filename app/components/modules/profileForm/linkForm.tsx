import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { LightTooltip } from "app/components/elements/styledComponents";
import { gigHelperTexts, skillOptions } from "app/constants/constants";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Url } from "url";

interface Props {}

export interface IInfoFormInput {
  github: Url;
  linkedIn: Url;
  twitter: Url;
  instagram: Url;
  behance: Url;
  discord: string;
  website: Url;
}

const LinkForm = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IInfoFormInput>();
  return (
    <div className="grid grid-cols-2 pt-8">
      <div className="m-2">
        <Controller
          name="github"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Gitub"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://github.com/john-smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-github" />
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="linkedIn"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="LinkedIn"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://instagram.com/john-smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-linkedin" />
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="twitter"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Twitter"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://twitter.com/john-smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-twitter" />
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="instagram"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Instagram"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://instagram.com/john-smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-instagram" />
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="discord"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Discord"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="john.smith#1111"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-discord"></i>
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="behance"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Behance"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://behance.net/john-smith"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-behance" />
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
      <div className="m-2">
        <Controller
          name="website"
          control={control}
          rules={{ minLength: 5 }}
          render={({ field, fieldState }) => (
            <LightTooltip
              arrow
              placement="right"
              title={gigHelperTexts["name"]}
            >
              <TextField
                {...field}
                label="Website"
                variant="standard"
                helperText={
                  fieldState.error?.type === "minLength" &&
                  "Gig title too short. Please make it more understandable."
                }
                fullWidth
                required
                error={fieldState.error ? true : false}
                placeholder="https://john-smith.com/"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="fab fa-firefox-browser"></i>
                    </InputAdornment>
                  ),
                }}
              />
            </LightTooltip>
          )}
        />
      </div>
    </div>
  );
};

export default LinkForm;
