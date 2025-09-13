import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import axiosClient from "~/hooks/useFetch";
import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";
import { Controller, useForm } from "react-hook-form";
import schema from "~/schemas/roleSchema";
import getLastError from "~/utils/onErrorValidate";

const listBreadcrumb = [
  {
    title: "Vai Trò",
    url: "/user/roles",
  },
  {
    title: "Sửa Vai Trò",
    url: "/role/edit",
  },
];

function Edit() {
  const { setBackDrop } = useContext(BackDropContext);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: undefined,
    },
  });

  const { id } = useParams();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const role = await axiosClient.get("/role/" + id);

        if (role.data.code == 1000) {
          const data = role.data.result;
          setValue("name", data.name);
          setValue("status", data.status);
          setValue("description", data.description);
        } else if (role.data.code != 9401 || role.data.code != 9400) {
          toast(role.data.result.message);
        }
      } catch (error: any) {
        toast.error("Tải dử liệu không thành công! vui lòng reload lại trang hoặc thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        status: data.status,
        description: data.description || null,
      };
      const res = await axiosClient.put("/role/" + id, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/user/roles", { state: { message: res.data.message } });
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

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Sửa Vai Trò" />
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

      {!loading && (
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
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên vai trò"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Mô tả"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
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
            <Button variant="outlined" size="large" onClick={() => navigate("/user/roles")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Vai Trò
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
