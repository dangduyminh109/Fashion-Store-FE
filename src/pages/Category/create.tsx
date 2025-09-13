import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-toastify";

import axiosClient from "~/hooks/useFetch";
import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";
import type CategoryTree from "~/types/categoryTree";
import flattenCategory from "~/utils/flattenCategory";

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/products",
  },
  {
    title: "Danh Mục",
    url: "/product/categories",
  },
  {
    title: "Tạo Mới Danh Mục",
    url: "/category/create",
  },
];


function Create() {
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [parentId, setParentId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { setBackDrop } = useContext(BackDropContext);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tree = await axiosClient.get(
          "http://localhost:8081/fashion-store/api/category/getTree"
        );
        if (tree.data.code == 1000) {
          const value = flattenCategory(tree.data.result, 0);
          setCategoryTree(value);
        } else if (tree.data.code != 9401 || tree.data.code != 9400) {
          toast(tree.data.result.message);
        }
      } catch (error: any) {
        toast.error("Tải danh sách mục cha không thành công!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleChangeFile(e: any) {
    setImage(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  async function handleSubmit() {
    if (name == "") {
      toast.error("Tên danh mục không được để trống!");
      return;
    }
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append("status", String(status));
      formData.append("name", name);
      formData.append("parentId", parentId);
      if (image) {
        formData.append("image", image);
      } else {
        const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
        formData.append("image", emptyFile);
      }
      const res = await axiosClient.post("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/product/categories", { state: { message: res.data.message } });
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Mới Danh Mục" />

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
                label="Tên danh mục"
                fullWidth
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel shrink id="demo-simple-select-label">
                  Danh mục cha
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  displayEmpty
                  label={"Danh mục cha"}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">Không chọn</MenuItem>
                  {categoryTree.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                        name="status"
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
                <img src={URL.createObjectURL(image)} alt="Ảnh danh mục" />
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
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/product/categories")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" onClick={handleSubmit}>
              Tạo Danh Mục
            </Button>
          </Box>
        </>
      )}
    </Fragment>
  );
}

export default Create;
