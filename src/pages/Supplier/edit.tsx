import { useContext, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";
import getLastError from "~/utils/onErrorValidate";
import schema from "~/schemas/supplierSchema";
import axiosClient from "~/hooks/useFetch";
import CircularProgress from "@mui/material/CircularProgress";

const listBreadcrumb = [
  {
    title: "Nhà Cung Cấp",
    url: "/suppliers",
  },
  {
    title: "Chỉnh Sửa Nhà Cung Cấp",
    url: "/supplier/edit",
  },
];

function Edit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supplier = await axiosClient.get("/supplier/" + id);
        if (supplier.data.code == 1000) {
          const data = supplier.data.result;
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("phone", data.phone);
          setValue("address", data.address);
          setValue("status", data.status);
        } else if (supplier.data.code != 9401 || supplier.data.code != 9400) {
          toast(supplier.data.result.message);
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
      formData.append(`name`, data.name);
      formData.append(`email`, data.email);
      formData.append(`phone`, data.phone);
      formData.append(`address`, data.address);
      formData.append(`status`, data.status);

      const res = await axiosClient.post("/supplier", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/suppliers", { state: { message: res.data.message } });
        return;
      }
      toast.error(res.data.message);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Sửa không thành công! Có lỗi xãy ra!");
      }
    } finally {
      setBackDrop(false);
    }
  };

  const onError = (data: any) => {
    toast.warning(getLastError(data));
  };

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Chỉnh Sửa Nhà Cung Cấp" />

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
            <Grid size={{ sm: 12 }}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên Nhà Cung Cấp"
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
                    label="Số Điện Thoại"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ sm: 12 }}>
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Địa Chỉ"
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

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/suppliers")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Nhà Cung Cấp
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
