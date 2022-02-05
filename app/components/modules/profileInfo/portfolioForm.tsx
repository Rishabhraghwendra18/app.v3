import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Controller,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { LightTooltip } from "app/components/elements/styledComponents";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobal } from "app/context/globalContext";
import { uploadFile } from "app/utils/moralis";
import { useMoralis } from "react-moralis";
import { PrimaryButton } from "app/components/elements/buttons/primaryButton";
2;
import EditIcon from "@mui/icons-material/Edit";
import { useProfile } from "pages/profile/[username]";

interface Props {}
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

export interface IPortfolioFormInput {
  portfolios: {
    title: string;
    link: string;
    ipfs: string;
  }[];
}

const PortfolioForm = ({}: Props) => {
  const {
    state: { userInfo },
    dispatch,
  } = useGlobal();
  const [loaderText, setLoaderText] = useState("Updating metadata");
  const [loading, setLoading] = useState(false);
  const { Moralis } = useMoralis();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const { editable } = useProfile();

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isDirty, isValid },
  } = useForm<IPortfolioFormInput>({
    defaultValues: {
      portfolios: userInfo?.get("portfolio") || undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "portfolios",
    control,
  });

  const onSubmit = (values) => {
    setLoaderText("Updating metadata...");
    setLoading(true);
    userInfo?.set("portfolio", values.portfolios);
    userInfo?.save().then((res) => {
      dispatch({
        type: "SET_USERINFO",
        value: res,
      });
      setLoading(false);
      handleClose();
    });
  };

  const FileInput = ({ control, name }) => {
    const { field } = useController({ control, name });
    const [thumbnailName,setThumbnailName]=useState<String>('logo3.png');
    return (
      <LightTooltip arrow placement="bottom" title={"image"}>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{
            textTransform: "none",
            mt: 2,
            mx: 4,
            width: "70%",
          }}
        >
          {field.value ? "Change File" : "Upload File"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target?.files) {
                setLoaderText("Uploading image to IPFS please wait");
                setLoading(true);
                setThumbnailName(e.target.files[0].name);
                uploadFile(Moralis, e.target.files[0])
                  .then((res: any) => {
                    field.onChange(res._ipfs);
                    setLoading(false);
                  })
                  .catch((err) => {
                    alert(err);
                    setThumbnailName('');
                    setLoading(false);
                  });
              }
            }}
            data-testid="portfolioThumbnail"
            data-thumbnailName={thumbnailName}
          />
        </Button>
      </LightTooltip>
    );
  };

  return (
    <div className="w-full">
      <PrimaryButton
        variant="outlined"
        size="small"
        fullWidth
        hidden={!editable}
        endIcon={<EditIcon />}
        onClick={() => setIsOpen(true)}
      >
        Edit Portfolio
      </PrimaryButton>
      <Modal open={isOpen} onClose={handleClose}>
        <Fade in={isOpen} timeout={500}>
          <Box sx={modalStyle}>
            <Backdrop
              sx={{
                color: "#eaeaea",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
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
                  {loaderText}
                </Typography>
              </Box>
            </Backdrop>
            <div className="flex flex-rw">
              <DialogTitle color="primary">Portfolios</DialogTitle>
              <div className="flex-auto"></div>
              <IconButton
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                sx={{ color: "#f45151", m: 1 }}
                data-testid="btnClose"
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="ml-4">
              <Button
                sx={{ color: "#99ccff" }}
                color="inherit"
                endIcon={<AddCircleOutlineIcon />}
                onClick={() => append({ title: "", link: "", ipfs: "" })}
                data-testid="btnAddPortfolio"
              >
                Add Portfolio
              </Button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col mx-4 w-full"
            >
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <div className="flex flex row py-1">
                        <div className="px-2 w-full">
                          <Controller
                            name={`portfolios.${index}.title`}
                            control={control}
                            rules={{ minLength: 3 }}
                            render={({ field, fieldState }) => (
                              <LightTooltip
                                arrow
                                placement="bottom"
                                title={"name"}
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
                                  data-testid="portfolioName"
                                />
                              </LightTooltip>
                            )}
                          />
                        </div>
                        <div className="px-2 w-full">
                          <Controller
                            name={`portfolios.${index}.link`}
                            control={control}
                            rules={{
                              pattern:
                                /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                            }}
                            render={({ field, fieldState }) => (
                              <LightTooltip
                                arrow
                                placement="bottom"
                                title={"link"}
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
                                  data-testid="portfolioLink"
                                />
                              </LightTooltip>
                            )}
                          />
                        </div>
                        <FileInput
                          name={`portfolios.${index}.ipfs`}
                          control={control}
                        />
                        <div className="flex flex-col items-center justify-center px-2">
                          <Button
                            color="inherit"
                            variant="outlined"
                            sx={{
                              mr: 1,
                              mt: 2,
                              color: "#f45151",
                              textTransform: "none",
                            }}
                            endIcon={<DeleteOutlineIcon />}
                            onClick={() => remove(index)}
                            data-testid="btnDeletePortfolio"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<SaveIcon />}
                  fullWidth
                  disabled={!isDirty || !isValid}
                  type="submit"
                  sx={{ width: "50%" }}
                  data-testid="btnSavePortfolio"
                >
                  Save
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default PortfolioForm;
