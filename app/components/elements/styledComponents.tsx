import {
  Avatar,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";

export const NavbarAvatar = styled(Avatar)(({ theme }) => ({
  height: 37,
  width: 37,
  objectFit: "cover",
  borderWidth: 2,
}));

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
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
