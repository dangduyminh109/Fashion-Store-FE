import { useContext, forwardRef, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import { Box } from "@mui/material";

import logo from "~/assets/images/Logo/logo-black.png";
import AuthFormContext from "~/client/context/AuthFormContext";
import { Login } from "./Login";
import { Register } from "./Register";
import { ForgotPassword } from "./ForgotPassword";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const AuthForm = () => {
  const { isShow, CloseAuthForm } = useContext(AuthFormContext);
  const disalogContentRef = useRef<HTMLElement | null>(null);

  function switchRegister() {
    if (disalogContentRef?.current) {
      disalogContentRef.current.style.transform = "translateX(-200%)";
    }
  }
  function switchForgot() {
    if (disalogContentRef?.current) {
      disalogContentRef.current.style.transform = "translateX(0)";
    }
  }
  function switchLogin() {
    if (disalogContentRef?.current) {
      disalogContentRef.current.style.transform = "translateX(-100%)";
    }
  }

  return (
    <Dialog
      open={isShow}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={CloseAuthForm}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            p: 1,
            maxWidth: "500px",
          }}
        >
          <Box sx={{ height: "30px" }}>
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Button sx={{ minWidth: "auto", p: 1 }} aria-label="Close">
            <i className="fa-solid fa-xmark" />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "background.default",
          maxWidth: "500px",
          overflow: "hidden",
          p: 0,
        }}
      >
        <Box
          ref={disalogContentRef}
          sx={{
            display: "flex",
            width: "100%",
            transition: "ease 0.3s",
            transform: "translateX(-100%)",
          }}
        >
          <Box sx={{ flex: "1 0 100%", px: 3 }}>
            <ForgotPassword switchLogin={switchLogin} />
          </Box>
          <Box sx={{ flex: "1 0 100%", px: 3 }}>
            <Login switchForgot={switchForgot} switchRegister={switchRegister} />
          </Box>
          <Box sx={{ flex: "1 0 100%", px: 3 }}>
            <Register switchLogin={switchLogin} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
