import { Avatar, styled } from "@mui/material";

export const NavbarAvatar = styled(Avatar)(({ theme }) => ({
  height: 37,
  width: 37,
  objectFit: "cover",
  borderWidth: 2,
}));
