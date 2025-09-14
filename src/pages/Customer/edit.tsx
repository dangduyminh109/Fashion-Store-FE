import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

import { BackDropContext } from "~/context/BackDrop";
import axiosClient from "~/hooks/useFetch";
import Breadcrumb from "~/components/Breadcrumb";
import { editSchema as schema } from "~/schemas/customerSchema";
import getLastError from "~/utils/onErrorValidate";
import type Customer from "~/types/customer";

function Edit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [avatarDelete, setAvatarDelete] = useState<boolean>(false);

  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();

  const { id } = useParams();
  const listBreadcrumb = [
    {
      title: "Khách Hàng",
      url: "/customers",
    },
    {
      title: "Chỉnh Sửa Khách Hàng",
      url: "/customer/edit/" + id,
    },
  ];

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      status: true,
      authProvider: "LOCAL",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const customer = await axiosClient.get("/customer/" + id);
        if (customer.data.code == 1000) {
          const data: Customer = customer.data.result;
          reset({
            fullName: data.fullName,
            status: data.status,
            email: data.email,
            phone: data.phone,
            authProvider: data.authProvider,
            providerId: data.providerId,
          });
          setPreviewAvatar(data.avatar);
        } else if (customer.data.code != 9401 || customer.data.code != 9400) {
          toast(customer.data.result.message);
        }
      } catch (error: any) {
        if (error.response?.data?.code == 9401 || error.response?.data?.code == 9400) {
          setError(error.response.data.message);
        }
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Tải dử liệu không thành công! Có lỗi xãy ra!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("avatarDelete", String(avatarDelete));
      formData.append("password", data.password);
      formData.append("status", data.status);
      formData.append("authProvider", data.authProvider);

      if (data.providerId) formData.append("providerId", data.providerId);
      if (data.phone) formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email);
      if (avatar) formData.append("avatar", avatar);

      const res = await axiosClient.put("/customer/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/customers", { state: { message: res.data.message } });
        return;
      }
      toast.error(res.data.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Tạo không thành công! Có lỗi xãy ra!");
      }
    } finally {
      setBackDrop(false);
    }
  };

  const onError = (data: any) => {
    toast.warning(getLastError(data));
  };

  function handleChangeFile(e: any) {
    setAvatar(e.target.files?.[0] ?? null);
    if (e.target.files?.[0]) {
      setPreviewAvatar(URL.createObjectURL(e.target.files?.[0]));
    }
    e.target.value = "";
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Chỉnh Sửa Khách Hàng" />
      {loading && (
        <Box
          sx={{
            with: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "text.secondary" }} />
        </Box>
      )}
      {!loading && error && <Box margin={"0 auto"}>{error}</Box>}
      {!loading && !error && (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Typography variant="h2">Thông Tin Chung</Typography>
          <Grid
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 2,
              p: 2,
              "& .MuiFormControl-root ": {
                m: 0,
              },
            }}
            container
            spacing={2}
          >
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="fullName"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên khách hàng"
                    variant="outlined"
                    fullWidth
                    required
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl sx={{ width: "100%" }} variant="outlined" error={!!fieldState.error}>
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu Mới</InputLabel>
                    <OutlinedInput
                      {...field}
                      autoComplete="off"
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
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
                      label="Mật khẩu Mới"
                    />
                    {fieldState.error && (
                      <FormHelperText>{fieldState.error.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Số điện thoại"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="providerId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="providerId"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="authProvider"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.authProvider} required>
                    <InputLabel shrink id="demo-simple-select-label">
                      Phương thức đăng kí
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"LOCAL"}>LOCAL</MenuItem>
                      <MenuItem value={"GMAIL"}>GMAIL</MenuItem>
                      <MenuItem value={"GOOGLE"}>GOOGLE</MenuItem>
                      <MenuItem value={"GUEST"}>GUEST</MenuItem>
                    </Select>
                    {errors.authProvider && (
                      <FormHelperText>{errors.authProvider.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" variant="standard">
                    <Typography>Trạng thái</Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            color="success"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label={field.value ? "Hoạt động" : "Không hoạt động"}
                      />
                    </FormGroup>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h2" mt={2}>
            Hình ảnh
          </Typography>
          <Box
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <input type="file" style={{ display: "none" }} id="image" onChange={handleChangeFile} />
            <Box
              component={"label"}
              htmlFor="image"
              sx={{
                height: "100px",
                maxWidth: "100%",
                minWidth: "50%",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "& img": {
                  maxHeight: "100%",
                  objectFit: "cover",
                },
              }}
            >
              {previewAvatar ? (
                <img src={previewAvatar} alt="Ảnh danh mục" />
              ) : (
                <FileUploadIcon fontSize="large" sx={{ fontSize: "54px" }} />
              )}
            </Box>
            {previewAvatar && (
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "error.main",
                  ":hover": {
                    backgroundColor: "error.main",
                  },
                }}
                onClick={() => {
                  setAvatar(null);
                  setPreviewAvatar("");
                  setAvatarDelete(true);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/customers")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Khách Hàng
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
