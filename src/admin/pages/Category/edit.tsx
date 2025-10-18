import { Fragment } from "react/jsx-runtime";
import Breadcrumb from "~/admin/components/Breadcrumb";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import axiosClient from "~/admin/hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BackDropContext } from "~/admin/context/BackDrop";
import type CategoryTree from "~/admin/types/categoryTree";
import flattenCategory from "~/utils/flattenCategory";
import { Controller, useForm } from "react-hook-form";
import schema from "~/admin/schemas/categorySchema";
import getLastError from "~/utils/onErrorValidate";
const API_PATH = import.meta.env.VITE_API_PATH;

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/admin/products",
  },
  {
    title: "Danh Mục",
    url: "/admin/product/categories",
  },
  {
    title: "Chỉnh sửa Danh Mục",
    url: "/admin/category/edit/:id",
  },
];

function Edit() {
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string>("");
  const [imageDelete, setImageDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setBackDrop } = useContext(BackDropContext);

  const navigate = useNavigate();
  const { id } = useParams();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      parentId: undefined,
      status: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [category, tree] = await Promise.all([
          axiosClient.get("/category/" + id),
          axiosClient.get(`${API_PATH}/category/getTree`, {
            params: { id },
          }),
        ]);
        if (category.data.code == 1000) {
          reset({
            name: category.data.result.name,
            parentId: category.data.result.parentId,
            status: category.data.result.status,
          });
          resizeTo;
          setPreviewImg(category.data.result.image);
        } else if (category.data.code != 9401 || category.data.code != 9400) {
          toast(category.data.result.message);
        }
        if (tree.data.code == 1000) {
          const value = flattenCategory(tree.data.result, 0);
          setCategoryTree(value);
        } else if (tree.data.code != 9401 || tree.data.code != 9400) {
          toast(tree.data.result.message);
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

  function handleChangeFile(e: any) {
    setImage(e.target.files?.[0] ?? null);
    if (e.target.files?.[0]) {
      setPreviewImg(URL.createObjectURL(e.target.files?.[0]));
    }
    e.target.value = "";
  }

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("status", String(data.status));
      formData.append("name", data.name);
      formData.append("imageDelete", String(imageDelete));
      if (data.parentId && data.parentId != -1) formData.append("parentId", String(data.parentId));
      if (image) {
        formData.append("image", image);
      }
      const res = await axiosClient.put("/category/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/admin/product/categories", { state: { message: res.data.message } });
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Chỉnh Sửa Danh Mục" />

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
            }}
            container
            spacing={3}
          >
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên danh mục"
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
                name="parentId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel shrink id="demo-simple-select-label">
                      Danh Mục Cha
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      displayEmpty
                      label={"Danh Mục Cha"}
                      value={field.value ?? "-1"}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="-1" selected>
                        Không chọn
                      </MenuItem>
                      {categoryTree.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
              {previewImg ? (
                <img src={previewImg} alt="Ảnh danh mục" />
              ) : (
                <FileUploadIcon fontSize="large" sx={{ fontSize: "54px" }} />
              )}
            </Box>
            {previewImg && (
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
                  setImage(null);
                  setPreviewImg("");
                  setImageDelete(true);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/admin/product/categories")}
            >
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Danh Mục
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
