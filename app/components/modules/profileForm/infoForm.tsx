import { Autocomplete, Button, TextField } from "@mui/material";
import { LightTooltip } from "app/components/elements/styledComponents";
import { profileHelperTexts, skillOptions } from "app/constants/constants";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import { useGlobal } from "app/context/globalContext";
import { useMoralis } from "react-moralis";

interface Props {
  handleNext: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IInfoFormInput {
  name: string;
  username: string;
  email: string;
  skills: Array<{ label: string }>;
  title: string;
}

const InfoForm = ({ handleNext, setLoading }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<IInfoFormInput>();
  const {
    state: { userInfo },
    dispatch,
  } = useGlobal();
  const { Moralis, user } = useMoralis();
  const onSubmit: SubmitHandler<IInfoFormInput> = async (values) => {
    console.log(values);
    setLoading(true);
    userInfo?.set("descriptionTitle", values.title);
    userInfo?.set("name", values.name);
    userInfo?.set("skills", values.skills);
    Moralis.Object.saveAll([userInfo as any])
      .then(([userInfo]) => {
        setLoading(false);
        dispatch({
          type: "SET_USERINFO",
          value: userInfo,
        });
        handleNext();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert(err);
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="ml-4 mr-32">
          <div className="my-2">
            <Controller
              name="name"
              control={control}
              defaultValue={userInfo?.get("name") || ""}
              rules={{ minLength: 2 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={profileHelperTexts["name"]}
                >
                  <TextField
                    {...field}
                    label="Name"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "minLength" &&
                      "Name too short. Please make it more understandable."
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
              defaultValue={userInfo?.get("spectUsername") || ""}
              rules={{ minLength: 5 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={profileHelperTexts["username"]}
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
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </LightTooltip>
              )}
            />
          </div>
          <div className="my-2">
            <Controller
              name="email"
              control={control}
              defaultValue={user?.get("email") || ""}
              rules={{ minLength: 5 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={profileHelperTexts["email"]}
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
                    InputProps={{
                      readOnly: true,
                    }}
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
                  title={profileHelperTexts["skills"]}
                >
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={skillOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, data) => field.onChange(data)}
                    defaultValue={userInfo?.get("skills")}
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
              name="title"
              control={control}
              defaultValue={userInfo?.get("descriptionTitle") || ""}
              rules={{ minLength: 5 }}
              render={({ field, fieldState }) => (
                <LightTooltip
                  arrow
                  placement="right"
                  title={profileHelperTexts["title"]}
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
        <div className="m-4">
          <Button
            variant="contained"
            endIcon={<SaveIcon />}
            fullWidth
            type="submit"
            disabled={!isDirty}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
