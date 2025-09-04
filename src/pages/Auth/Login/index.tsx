import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { ThemeContext } from "~/context/ThemeContext";
import axiosClient from "~/hooks/useFetch";
import LogoWhite from "~/assets/images/logo-white.png";
import LogoBlack from "~/assets/images/logo-black.png";
import { AuthContext } from "~/context/AuthContext";

export const Login = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { mode } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  async function handleSubmit() {
    if (!userName || !password) {
      toast.error("Vui lòng nhập username và password!!!");
      return;
    }
    setLoading(true);
    try {
      const res = (
        await axiosClient.request({
          url: "/auth/login",
          method: "post",
          data: {
            username: userName,
            password,
          },
        })
      ).data;
      if (res.code === 1000) {
        localStorage.setItem("token", res.result.token);
        const data = (await axiosClient.get("/user/myInfo")).data;
        localStorage.setItem("user", JSON.stringify(data.result));
        setUser(data.result);
        setLoading(false);
        navigate("/", { replace: true });
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      let message = "Đăng nhập không thành công có lỗi xãy ra!!!";
      if (error.response.data.code == 9400) message = "Username hoặc mật khẩu không chính xác!";
      else if (error.response.data.code == 9400) message = "Tài khoản không hợp lệ!";
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        gap={3}
        sx={{
          bgcolor: "background.paper",
          minWidth: "350px",
          padding: "20px",
          borderRadius: "10px",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.01)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={mode ? LogoWhite : LogoBlack} alt="logo" />
        </Box>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel
            htmlFor="outlined-adornment-username"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": {
                color: "text.secondary",
              },
              p: "0 5px",
            }}
          >
            Username
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-username"
            value={userName}
            onChange={(e) => setUserName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.primary",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.secondary",
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 100px transparent inset",
                WebkitTextFillColor: mode ? "#fff" : "#1F2937",
                transition: "background-color 5000s ease-in-out 0s",
              },
            }}
          ></OutlinedInput>
        </FormControl>

        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel
            htmlFor="outlined-adornment-password"
            sx={{
              color: "text.primary",
              bgcolor: "background.default",
              "&.Mui-focused": {
                color: "text.secondary",
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
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.primary",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "text.secondary",
              },
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
        <Button size="large" fullWidth onClick={handleSubmit} variant="outlined" loading={loading}>
          Đăng Nhập
        </Button>
      </Stack>
    </Container>
  );
};
