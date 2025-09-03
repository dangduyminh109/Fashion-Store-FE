import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import * as React from "react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface ConfirmModelProps {
  title: string;
  open: boolean;
  content: ReactNode;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  handleSubmit: () => any;
}

const ConfirmModel = (props: ConfirmModelProps) => {
  const { title, open, content, setOpen, handleSubmit } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{content}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={() => handleSubmit()} sx={{ color: "#fff", bgcolor: "error.main" }}>
            Xác nhận
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default ConfirmModel;
