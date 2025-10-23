import { Grid } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

import { BackDropContext } from "~/client/context/BackDrop";
import defaultImg from "~/assets/images/default-image.png";
import PrimaryButton from "~/client/components/PrimaryButton";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import { AuthContext } from "~/client/context/AuthContext";

export const MyProfile = () => {
  const [fullname, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [avatarDelete, setAvatarDelete] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const { customer, setCustomer } = useContext(AuthContext);

  useEffect(() => {
    console.log(customer?.email);

    if (customer) {
      setFullName(customer.fullName);
      setPhone(customer.phone);
      setEmail(customer.email);
      setAvatarPreview(customer.avatar || "");
    }
  }, [customer]);

  function handleChangeFile(e: any) {
    setAvatar(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  async function handleSubmit() {
    if (!fullname) {
      toast.error("Vui lòng nhập họ tên!!!");
      return;
    }
    setLoading(true);
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullname);
      formData.append("avatarDelete", String(avatarDelete));

      if (phone) formData.append("phone", phone);
      if (email) formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const res = await axiosClient.put("/customer/update-info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code === 1000) {
        setLoading(false);
        setCustomer(res.data.result);
        toast.success("Cập nhật thành công!");
        localStorage.setItem("customer", JSON.stringify(res.data.result));
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      let message = "Cập nhật không thành công có lỗi xãy ra!!!";
      toast.error(message);
    } finally {
      setLoading(false);
      setBackDrop(false);
    }
  }
  return (
    <Box
      sx={{
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        width: "99%",
        height: "100%",
        p: 2,
      }}
    >
      <Typography variant="h3" my={1}>
        Quản Lý Thông Tin Hồ Sơ
      </Typography>
      <hr />
      <Grid container py={2}>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            md: {
              borderRight: "1px solid #ccc",
              pr: 2,
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              position: "relative",
              "& img": {
                maxWidth: "150px",
                borderRadius: "50%",
                border: `1px dashed #000`,
                aspectRatio: "1/1",
                objectFit: "cover",
              },
            }}
          >
            <input
              type="file"
              ref={inputRef}
              style={{ display: "none" }}
              id="avatar"
              onChange={handleChangeFile}
            />
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : avatarPreview != ""
                  ? avatarPreview
                  : defaultImg
              }
              alt="Ảnh danh mục"
            />
            {(avatar || avatarPreview) && (
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: "20%",
                  backgroundColor: "error.main",
                  color: "#fff",
                  ":hover": {
                    backgroundColor: "error.main",
                  },
                }}
                onClick={() => {
                  setAvatar(null);
                  setAvatarDelete(true);
                  setAvatarPreview("");
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <PrimaryButton
            sx={{ m: "0 auto", display: "block" }}
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Chọn ảnh
          </PrimaryButton>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <FormControl fullWidth variant="outlined" sx={{ my: 1 }} size="small">
            <InputLabel
              shrink={Boolean(fullname)}
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
              value={fullname}
              onChange={(e) => setFullName(e.currentTarget.value)}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ my: 1 }} size="small">
            <InputLabel
              shrink={Boolean(email)}
              htmlFor="register-name"
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
              id="register-name"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ my: 1 }} size="small">
            <InputLabel
              shrink={Boolean(phone)}
              htmlFor="register-name"
              sx={{
                color: "text.primary",
                bgcolor: "background.default",
                "&.Mui-focused": { color: "text.primary" },
                p: "0 5px",
              }}
            >
              Số Điện Thoại
            </InputLabel>
            <OutlinedInput
              id="register-name"
              required
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
            />
          </FormControl>
        </Grid>
      </Grid>
      <PrimaryButton
        disabled={loading}
        sx={{ display: "block", ml: "auto" }}
        onClick={() => handleSubmit()}
      >
        Lưu
      </PrimaryButton>
    </Box>
  );
};
