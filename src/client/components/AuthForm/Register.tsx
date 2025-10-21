import { Fragment, useContext, useRef, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

import { BackDropContext } from "~/client/context/BackDrop";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import PrimaryButton from "../PrimaryButton";

export const Register = ({ switchLogin }: { switchLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const [disableSendcode, setDisableSendcode] = useState(false);
  const btnSendCodeRef = useRef<HTMLButtonElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleSubmit() {
    if (!email || !password || !fullname) {
      toast.error("Vui lòng nhập đầy đủ thông tin!!!");
      return;
    }
    setLoading(true);
    setBackDrop(true);
    try {
      const res = (
        await axiosClient.request({
          url: "/auth/register",
          method: "post",
          data: {
            email,
            fullName: fullname,
            password,
            otp: code,
          },
        })
      ).data;
      if (res.code === 1000) {
        setLoading(false);
        toast.success("Đăng kí thành công!");
        switchLogin();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      let message = "Đăng kí không thành công có lỗi xãy ra!!!";
      if (error.response?.data?.code == 9411) message = "OTP không hợp lệ!";
      toast.error(message);
    } finally {
      setLoading(false);
      setBackDrop(false);
    }
  }

  function disableSendCode() {
    setDisableSendcode(true);
    let minute = 2;
    let second = 59;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (btnSendCodeRef.current) {
        btnSendCodeRef.current.innerText = `${minute.toString().padStart(2, "0")}:${second
          .toString()
          .padStart(2, "0")}`;
      }

      if (second > 0) {
        second--;
      } else if (minute > 0) {
        second = 59;
        minute--;
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        if (btnSendCodeRef.current) {
          btnSendCodeRef.current.innerText = "Gửi mã";
        }
        setDisableSendcode(false);
      }
    }, 1000);
  }

  async function handleSendCode() {
    if (!email) {
      toast.error("Vui lòng nhập Email!!!");
      return;
    }
    setLoading(true);
    setBackDrop(true);
    try {
      const res = (
        await axiosClient.request({
          url: "/auth/send-otp",
          method: "post",
          data: {
            email,
          },
        })
      ).data;
      if (res.code === 1000) {
        setLoading(false);
        disableSendCode();
        toast.success("Gửi mã thành công!");
        disableSendCode();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      let message = "Gửi mã không thành công có lỗi xãy ra!!!";
      toast.error(message);
    } finally {
      setLoading(false);
      setBackDrop(false);
    }
  }

  return (
    <Fragment>
      <Typography
        variant="h2"
        sx={{ fontSize: "2.5rem", textAlign: "center", color: "text.primary" }}
      >
        Đăng ký
      </Typography>

      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="register-name"
          sx={{
            color: "text.primary",
            bgcolor: "background.default",
            "&.Mui-focused": { color: "text.primary" },
            p: "0 5px",
          }}
        >
          Họ tên
        </InputLabel>
        <OutlinedInput
          id="register-name"
          required
          onChange={(e) => setFullName(e.currentTarget.value)}
        />
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
          <InputLabel
            htmlFor="register-email"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": { color: "text.primary" },
              p: "0 5px",
            }}
          >
            Email
          </InputLabel>
          <OutlinedInput
            id="register-email"
            type="email"
            required
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
          <InputLabel
            htmlFor="register-password"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": { color: "text.primary" },
              p: "0 5px",
            }}
          >
            Mật khẩu
          </InputLabel>
          <OutlinedInput
            id="register-password"
            type={showPassword ? "text" : "password"}
            required
            onChange={(e) => setPassword(e.currentTarget.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", my: 1 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel
            htmlFor="register-confirm"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": { color: "text.primary" },
              p: "0 5px",
            }}
          >
            Mã xác nhận
          </InputLabel>
          <OutlinedInput
            id="register-confirm"
            required
            onChange={(e) => setCode(e.currentTarget.value)}
          />
        </FormControl>
        <Button
          ref={btnSendCodeRef}
          disabled={loading || disableSendcode}
          variant="contained"
          onClick={handleSendCode}
          sx={{
            fontSize: "1.6rem",
            bgcolor: "primary.main",
            height: "56px",
            color: "text.secondary",
            borderRadius: "5px",
            width: "30%",
            "&:hover": {
              bgcolor: "secondary.main",
              color: "#fff",
            },
          }}
        >
          Gửi mã
        </Button>
      </Box>

      <Button
        variant="contained"
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          fontSize: "1.6rem",
          mt: "10px",
          borderRadius: 0,
          bgcolor: "primary.main",
          color: "text.secondary",
          "&:hover": {
            bgcolor: "secondary.main",
            color: "#fff",
          },
        }}
      >
        Đăng ký
      </Button>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: "10px",
          my: 2,
        }}
      >
        <Box sx={{ height: "1px", flex: 1, bgcolor: "text.primary" }} />
        <Typography sx={{ fontSize: "1.4rem" }}>Hoặc</Typography>
        <Box sx={{ height: "1px", flex: 1, bgcolor: "text.primary" }} />
      </Box>

      <Box sx={{ display: "flex", gap: "15px" }}>
        <PrimaryButton
          fullWidth
          sx={{ textAlign: "center", display: "flex", alignItems: "center" }}
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

      {/* Link đăng nhập */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography component="span" sx={{ fontSize: "1.4rem" }}>
          Bạn đã có tài khoản?{" "}
        </Typography>
        <Button
          variant="text"
          onClick={switchLogin}
          sx={{
            color: "secondary.main",
            fontSize: "1.4rem",
            cursor: "pointer",
            background: "transparent",
          }}
        >
          Đăng Nhập
        </Button>
      </Box>
    </Fragment>
  );
};
