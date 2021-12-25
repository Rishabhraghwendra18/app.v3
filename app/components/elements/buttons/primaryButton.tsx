import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { purple } from "@mui/material/colors";

export const PrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText("#000f29"),
  borderRadius: "20px",
  textTransform: "none",
}));
