import { Fragment, useContext, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { BackDropContext } from "~/client/context/BackDrop";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import { checkPassword } from "~/utils/checkPassword";

export const ForgotPassword = ({ switchLogin }: { switchLogin: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleTogglePasswordConfirm = () => setShowPasswordConfirm((prev) => !prev);

  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const [disableSendcode, setDisableSendcode] = useState(false);
  const btnSendCodeRef = useRef<HTMLButtonElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleSubmit() {
    if (!email || !newPassword || !confirmPassword || !code) {
      toast.error("Vui lòng nhập đầy đủ thông tin!!!");
      return;
    }

    if (newPassword != confirmPassword) {
      toast.error("Mật khẩu không khớp!!!");
      return;
    }

    if (checkPassword(newPassword)) {
      toast.error(checkPassword(newPassword));
      return;
    }

    setLoading(true);
    setBackDrop(true);
    try {
      const res = (
        await axiosClient.request({
          url: "/auth/forgot-password",
          method: "post",
          data: {
            email,
            newPassword,
            confirmPassword,
            otp: code,
          },
        })
      ).data;
      if (res.code === 1000) {
        setLoading(false);
        toast.success("Đổi mật khẩu thành công!");
        switchLogin();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      let message = "Đổi mật khẩu không thành công có lỗi xãy ra!!!";
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
        sx={{
          fontSize: "2.5rem",
          textAlign: "center",
          color: "text.primary",
          transition: "ease 0.3s",
          "&:hover": {
            color: "secondary.main",
          },
        }}
      >
        Quên mật khẩu
      </Typography>

      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="forgot-email"
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
          id="forgot-email"
          type="email"
          required
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", my: 1 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel
            htmlFor="forgot-confirm"
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
            id="forgot-confirm"
            required
            onChange={(e) => setCode(e.currentTarget.value)}
          />
        </FormControl>
        <Button
          variant="contained"
          disabled={loading || disableSendcode}
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

      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="forgot-password"
          sx={{
            color: "text.primary",
            bgcolor: "background.default",
            "&.Mui-focused": { color: "text.primary" },
            p: "0 5px",
          }}
        >
          Mật khẩu mới
        </InputLabel>
        <OutlinedInput
          id="forgot-password"
          type={showPassword ? "text" : "password"}
          required
          onChange={(e) => setNewPassword(e.currentTarget.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
        <InputLabel
          htmlFor="forgot-password-confirm"
          sx={{
            color: "text.primary",
            bgcolor: "background.default",
            "&.Mui-focused": { color: "text.primary" },
            p: "0 5px",
          }}
        >
          Xác nhận mật khẩu
        </InputLabel>
        <OutlinedInput
          id="forgot-password-confirm"
          type={showPasswordConfirm ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordConfirm} edge="end">
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

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
        Đổi mật khẩu
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <Typography component="span" sx={{ fontSize: "1.4rem" }}>
          Bạn đã nhớ mật khẩu?{" "}
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
