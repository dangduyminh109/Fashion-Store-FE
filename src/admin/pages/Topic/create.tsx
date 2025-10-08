import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
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
import { toast } from "react-toastify";

import axiosClient from "~/admin/hooks/useFetch";
import { BackDropContext } from "~/admin/context/BackDrop";
import Breadcrumb from "~/admin/components/Breadcrumb";
import { Controller, useForm } from "react-hook-form";
import schema from "~/admin/schemas/topicSchema";
import getLastError from "~/utils/onErrorValidate";

const listBreadcrumb = [
  {
    title: "Chủ Đề Bài Viết",
    url: "/admin/topics",
  },
  {
    title: "Tạo Mới Chủ Đề",
    url: "/admin/topic/create",
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
    },
  });

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("status", String(data.status));
      formData.append("name", data.name);

      const res = await axiosClient.post("/topic", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/admin/post/topics", { state: { message: res.data.message } });
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Mới Chủ Đề" />
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
                  label="Tên chủ đề"
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
          <Button variant="outlined" size="large" onClick={() => navigate("/admin/post/topics")}>
            Quay Lại
          </Button>
          <Button variant="outlined" size="large" type="submit">
            Tạo Chủ Đề
          </Button>
        </Box>
      </form>
    </Fragment>
  );
}

export default Create;
