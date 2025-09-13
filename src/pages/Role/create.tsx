import { useContext } from "react";
import { useNavigate } from "react-router-dom";
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


import { BackDropContext } from "~/context/BackDrop";
import axiosClient from "~/hooks/useFetch";
import Breadcrumb from "~/components/Breadcrumb";
import schema from "~/schemas/roleSchema";
import getLastError from "~/utils/onErrorValidate";

const listBreadcrumb = [
  {
    title: "Vai Trò",
    url: "/user/roles",
  },
  {
    title: "Tạo Mới Vai Trò",
    url: "/role/create",
  },
];

function Create() {
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      status: true,
      description: undefined,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        status: data.status,
        description: data.description || null,
      };
      const res = await axiosClient.post("/role", payload, {
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Mới Vai Trò" />
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
                  rows={4}
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

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
          <Button variant="outlined" size="large" onClick={() => navigate("/user/roles")}>
            Quay Lại
          </Button>
          <Button variant="outlined" size="large" type="submit">
            Tạo Vai Trò
          </Button>
        </Box>
      </form>
    </Fragment>
  );
}

export default Create;
