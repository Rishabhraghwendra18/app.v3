import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { create } from "react-modal-promise";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

interface props {
  isOpen: any;
  onResolve: any;
  onReject: any;
  text: string;
}

const Modal = ({ isOpen, onResolve, onReject, text }: props) => (
  <Dialog open={isOpen} onClose={onReject}>
    <DialogTitle>Confirm?</DialogTitle>
    <DialogContent>
      <DialogContentText>{text}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onReject} variant="outlined" endIcon={<ClearIcon />}>
        Nevermind
      </Button>
      <Button onClick={onResolve} variant="outlined" endIcon={<DoneIcon />}>
        Hell yeah!
      </Button>
    </DialogActions>
  </Dialog>
);

export const ConfirmModal = create(Modal as any) as any;
