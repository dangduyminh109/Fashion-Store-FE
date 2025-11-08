import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import LogoImg from "~/assets/images/Logo/logo-black.png";
import Box from "@mui/material/Box";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface SearchBoxProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  handleSubmit: () => any;
}

const SearchBox = (props: SearchBoxProps) => {
  const { open, setOpen, handleSubmit } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        sx={{
          mb: "30%",
        }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 1, bgcolor: "background.default" }}
          id="customized-dialog-title"
        >
          <Box
            component={"img"}
            src={LogoImg}
            alt="logo"
            sx={{
              objectFit: "contain",
              height: "30px",
            }}
          />
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
        <DialogContent dividers sx={{ bgcolor: "background.default", p: " 5px 15px !important" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              pl: 2,
              pr: 1,
              borderRadius: "999px",
              border: "1px solid #000",
              minWidth: {
                lg: 500,
                md: 400,
                sm: 250,
              },
            }}
          >
            <InputBase
              sx={{ flex: 1 }}
              placeholder="Tìm kiếm"
              inputProps={{ "aria-label": "Tìm kiếm" }}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default SearchBox;
