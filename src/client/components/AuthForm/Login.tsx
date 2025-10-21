import { Fragment, useContext, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { toast } from "react-toastify";

import axiosClient from "~/client/hooks/useFetch";
import PrimaryButton from "../PrimaryButton";
import { BackDropContext } from "~/client/context/BackDrop";
import AuthFormContext from "~/client/context/AuthFormContext";
import { AuthContext } from "~/client/context/AuthContext";
const googleApi = import.meta.env.VITE_GOOGLE_API;

export const Login = ({
  switchRegister,
  switchForgot,
}: {
  switchRegister: () => void;
  switchForgot: () => void;
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { CloseAuthForm } = useContext(AuthFormContext);
  const { setCustomer } = useContext(AuthContext);

  async function handleSubmit() {
    if (!email || !password) {
      toast.error("Vui lòng nhập email và password!!!");
      return;
    }
    setLoading(true);
    setBackDrop(true);
    try {
      const res = (
        await axiosClient.request({
          url: "/auth/login",
          method: "post",
          data: {
            email: email,
            password,
          },
        })
      ).data;
      if (res.code === 1000) {
        localStorage.setItem("customer-token", res.result.token);
        const data = (await axiosClient.get("/customer/me")).data;
        localStorage.setItem("customer", JSON.stringify(data.result));
        setCustomer(data.result);
        setLoading(false);
        CloseAuthForm();
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      let message = "Đăng nhập không thành công có lỗi xãy ra!!!";
      if (error.response?.data?.code == 9400) message = "Email hoặc mật khẩu không chính xác!";
      else if (error.response?.data?.code == 9400) message = "Tài khoản không hợp lệ!";
      toast.error(message);
    } finally {
      setLoading(false);
      setBackDrop(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = googleApi;
  }

  return (
    <Fragment>
      <Typography variant="h2" sx={{ fontSize: "3rem", textAlign: "center" }}>
        Đăng Nhập
      </Typography>
      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="outlined-adornment-email"
          sx={{
            color: "text.primary",
            bgcolor: "background.default",
            "&.Mui-focused": {
              color: "text.primary",
            },
            p: "0 5px",
          }}
        >
          Email
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        ></OutlinedInput>
      </FormControl>

      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="outlined-adornment-password"
          sx={{
            color: "text.primary",
            bgcolor: "background.default",
            "&.Mui-focused": {
              color: "text.primary",
            },
            p: "0 5px",
          }}
        >
          Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "hide the password" : "display the password"}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          fontSize: "1.6rem",
          mt: "10px",
          borderRadius: 0,
          transition: "ease 0.3s",
          "&:hover": {
            bgcolor: "secondary.main",
            color: "text.secondary",
          },
        }}
      >
        Đăng nhập
      </Button>

      <Button
        variant="text"
        onClick={switchForgot}
        sx={{
          fontSize: "1.4rem",
          mt: 1,
          cursor: "pointer",
          transition: "0.2s",
          background: "transparent",
          "&:hover": { color: theme.palette.primary.main },
        }}
      >
        Quên mật khẩu?
      </Button>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: "10px",
          my: 1,
        }}
      >
        <Box sx={{ height: "1px", flex: 1, bgcolor: theme.palette.text.primary }} />
        <Typography sx={{ fontSize: "1.4rem" }}>Hoặc</Typography>
        <Box sx={{ height: "1px", flex: 1, bgcolor: theme.palette.text.primary }} />
      </Box>
      <Box sx={{ display: "flex", gap: "15px" }}>
        <PrimaryButton
          fullWidth
          sx={{ textAlign: "center", display: "flex", alignItems: "center" }}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon fontSize="large" /> Google
        </PrimaryButton>
        <PrimaryButton
          fullWidth
          sx={{ textAlign: "center", display: "flex", alignItems: "center" }}
        >
          <FacebookIcon fontSize="large" /> Facebook
        </PrimaryButton>
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography component="span" sx={{ fontSize: "1.4rem" }}>
          Bạn chưa có tài khoản?{" "}
        </Typography>
        <Button
          variant="text"
          onClick={switchRegister}
          sx={{
            color: "secondary.main",
            fontSize: "1.4rem",
            cursor: "pointer",
            background: "transparent",
            display: "inline",
          }}
        >
          Đăng ký
        </Button>
      </Box>
    </Fragment>
  );
};
