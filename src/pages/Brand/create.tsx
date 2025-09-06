import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-toastify";

import axiosClient from "~/hooks/useFetch";
import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";

const listBreadcrumb = [
  {
    title: "Thương Hiệu",
    url: "/brands",
  },
  {
    title: "Tạo Mới Thương Hiệu",
    url: "/brand/create",
  },
];

function Create() {
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(true);
  const { setBackDrop } = useContext(BackDropContext);

  const navigate = useNavigate();

  function handleChangeFile(e: any) {
    setImage(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  async function handleSubmit() {
    if (name == "") {
      toast.error("Tên thương hiệu không được để trống!");
      return;
    }
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("status", String(status));
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      } else {
        const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
        formData.append("image", emptyFile);
      }
      const res = await axiosClient.post("/brand", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/brands", { state: { message: res.data.message } });
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
  }
  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Mới Thương Hiệu" />
      <>
        <Typography variant="h2">Thông Tin Chung</Typography>
        <Grid
          sx={{
            borderRadius: "10px",
            border: (theme) => `1px dashed ${theme.palette.text.primary}`,
            mt: 2,
            p: 2,
          }}
          container
          spacing={3}
        >
          <Grid size={12}>
            <TextField
              required
              id="outlined-required"
              label="Tên thương hiệu"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <FormControl component="fieldset" variant="standard">
              <Typography>Trạng thái</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      checked={status}
                      onChange={() => setStatus(!status)}
                      name="gilad"
                    />
                  }
                  label={status ? "Hoạt động" : "Không hoạt động"}
                />
              </FormGroup>
            </FormControl>
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
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Ảnh thương hiệu" />
            ) : (
              <FileUploadIcon fontSize="large" sx={{ fontSize: "54px" }} />
            )}
          </Box>
          {image && (
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
              onClick={() => setImage(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
          <Button variant="outlined" size="large" onClick={() => navigate("/brands")}>
            Quay Lại
          </Button>
          <Button variant="outlined" size="large" onClick={handleSubmit}>
            Tạo Thương Hiệu
          </Button>
        </Box>
      </>
    </Fragment>
  );
}

export default Create;
