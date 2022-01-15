import { Autocomplete, Button, InputAdornment, TextField } from "@mui/material";
import { LightTooltip } from "app/components/elements/styledComponents";
import {
  animationVariant,
  gigHelperTexts,
  skillOptions,
} from "app/constants/constants";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";
import { useGlobal } from "app/context/globalContext";
import { useMoralis } from "react-moralis";
import { motion } from "framer-motion";

interface Props {
  handleClose: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ILinkFormInput {
  github: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  behance: string;
  discord: string;
  website: string;
}

const LinkForm = ({ handleClose, setLoading }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ILinkFormInput>();
  const {
    state: { userInfo },
    dispatch,
  } = useGlobal();
  const { Moralis, user } = useMoralis();
  const onSubmit: SubmitHandler<ILinkFormInput> = async (values) => {
    setLoading(true);
    userInfo?.set("github", values.github);
    userInfo?.set("twitter", values.twitter);
    userInfo?.set("linkedIn", values.linkedIn);
    userInfo?.set("instagram", values.instagram);
    userInfo?.set("discord", values.discord);
    userInfo?.set("behance", values.behance);
    userInfo?.set("website", values.website);

    Moralis.Object.saveAll([userInfo as any])
      .then(([userInfo]) => {
        setLoading(false);
        dispatch({
          type: "SET_USERINFO",
          value: userInfo,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert(err);
      });
  };
  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={animationVariant}
    >
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 py-12">
            <div className="m-2">
              <Controller
                name="github"
                control={control}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                defaultValue={userInfo?.get("github")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Gitub"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
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
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="linkedIn"
                control={control}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                defaultValue={userInfo?.get("linkedIn")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="LinkedIn"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
                    error={fieldState.error ? true : false}
                    placeholder="https://linkedIn.com/john-smith"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="fab fa-linkedin" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="twitter"
                control={control}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                defaultValue={userInfo?.get("twitter")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Twitter"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
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
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="instagram"
                control={control}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                defaultValue={userInfo?.get("instagram")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Instagram"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
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
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="discord"
                control={control}
                rules={{
                  pattern: /^.{3,32}#[0-9]{4}$/,
                }}
                defaultValue={userInfo?.get("discord")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Discord"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Wrong discord username. Please provide the correct username."
                    }
                    fullWidth
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
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="behance"
                control={control}
                defaultValue={userInfo?.get("behance")}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Behance"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
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
                )}
              />
            </div>
            <div className="m-2">
              <Controller
                name="website"
                control={control}
                rules={{
                  pattern:
                    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                }}
                defaultValue={userInfo?.get("website")}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Website"
                    variant="standard"
                    helperText={
                      fieldState.error?.type === "pattern" &&
                      "Invalid URL. Please provide the correct URL."
                    }
                    fullWidth
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
                )}
              />
            </div>
          </div>
          <div className="m-4">
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              fullWidth
              disabled={!isDirty}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </motion.main>
  );
};

export default LinkForm;
