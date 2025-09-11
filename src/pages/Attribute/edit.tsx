import { useContext, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";

import axiosClient from "~/hooks/useFetch";
import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";
import type AttributeValue from "~/types/attributeValue";
import getLastError from "~/utils/onErrorValidate";
import { editSchema as schema } from "~/schemas/attributeSchema";

const listBreadcrumb = [
  {
    title: "Thuộc Tính",
    url: "/attributes",
  },
  {
    title: "Sửa Thuộc Tính",
    url: "/attribute/edit",
  },
];

function Edit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const { control, handleSubmit, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      attributeDisplayType: "TEXT",
      listAttributeValue: [
        {
          id: "",
          value: "",
          color: "#000",
          image: undefined,
        },
      ],
    },
  });
  const { id } = useParams();
  const [listAttributeValue, setListAttributeValue] = useState(getValues("listAttributeValue"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const attribute = await axiosClient.get(
          "http://localhost:8081/fashion-store/api/admin/attribute/" + id
        );
        if (attribute.data.code == 1000) {
          const data = attribute.data.result;
          setValue("name", data.name);
          setValue("attributeDisplayType", data.attributeDisplayType);
          data.listAttributeValue?.forEach((attributeValue: AttributeValue, index: number) => {
            setValue(`listAttributeValue.${index}.id`, `${attributeValue?.id}` || "");
            setValue(`listAttributeValue.${index}.color`, attributeValue?.color || "");
            setValue(`listAttributeValue.${index}.value`, attributeValue?.value || "");
            setValue(
              `listAttributeValue.${index}.imgPreview`,
              attributeValue?.image ? `${attributeValue?.image}` : ""
            );
          });
          setListAttributeValue(getValues("listAttributeValue"));
        } else if (attribute.data.code != 9401 || attribute.data.code != 9400) {
          toast(attribute.data.result.message);
        }
      } catch (error: any) {
        if (error.response?.data?.code == 9401 || error.response?.data?.code == 9400) {
          setError(error.response.data.message);
        }
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Cập nhật không thành công! Có lỗi xãy ra!");
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
      formData.append(`attributeDisplayType`, data.attributeDisplayType);
      data.listAttributeValue.forEach((item: any, index: number) => {
        formData.append(`listAttributeValue[${index}].value`, item.value);
        formData.append(`listAttributeValue[${index}].color`, item.color);
        formData.append(`listAttributeValue[${index}].imageDelete`, item.imageDelete || false);
        if (item.image) {
          formData.append(`listAttributeValue[${index}].image`, item.image);
        }
      });

      const res = await axiosClient.put("/attribute/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/product/attributes", { state: { message: res.data.message } });
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

  function handleAddValue() {
    const prevList = getValues("listAttributeValue");
    const newList = [
      {
        value: "",
        color: "#000",
        image: undefined,
        imageDelete: false,
      },
      ...(prevList || []),
    ];
    setListAttributeValue(newList);
    setValue("listAttributeValue", newList);
  }
  function handleRemoveValue(item: any) {
    const prevList = getValues("listAttributeValue");
    const index = listAttributeValue?.indexOf(item);
    const newList = prevList?.filter((item, idx) => index != idx);
    setListAttributeValue(newList);
    setValue("listAttributeValue", newList);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Sửa Thuộc Tính" />

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
                    label="Tên Thuộc Tính"
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
                name="attributeDisplayType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel shrink id="demo-simple-select-label">
                      Loại Hiển Thị
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      displayEmpty
                      label={"Danh Mục"}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="TEXT">Mặc định</MenuItem>
                      <MenuItem value="SELECT">Danh sách</MenuItem>
                      <MenuItem value="COLOR">Màu sắc</MenuItem>
                      <MenuItem value="IMAGE">Hình ảnh</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h2" mt={2}>
            Giá Trị Thuộc Tính
          </Typography>
          <Box
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 1,
              p: 2,
            }}
          >
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAddValue()}>
              Thêm Giá Trị
            </Button>
            {listAttributeValue?.map((item, index) => (
              <Grid
                key={index}
                container
                spacing={2}
                alignItems={"center"}
                sx={{ m: "15px 0", height: "56px", "& .MuiGrid-root": { height: "100%" } }}
              >
                <Grid size={6}>
                  <Controller
                    name={`listAttributeValue.${index}.value`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        value={field.value || ""}
                        label="Giá Trị"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!fieldState.error}
                        sx={{ m: 0 }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={1}
                  sx={{
                    "& input": {
                      border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                      background: "transparent",
                    },
                  }}
                >
                  <Controller
                    name={`listAttributeValue.${index}.color`}
                    control={control}
                    render={({ field }) => (
                      <input
                        type="color"
                        {...field}
                        value={field.value ?? "#000000"}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "5px",
                          padding: 4,
                          cursor: "pointer",
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid
                  size={4}
                  sx={{
                    "& input": {
                      border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                      background: "transparent",
                    },
                  }}
                >
                  <Controller
                    name={`listAttributeValue.${index}.image`}
                    control={control}
                    render={({ field }) => {
                      const inputId = `image-${index}`;
                      const value = field.value;
                      let image = "";
                      if (value) {
                        image = URL.createObjectURL(value);
                      } else if (item.imgPreview && !item.imageDelete) {
                        image = item.imgPreview;
                      }

                      return (
                        <Box
                          sx={{
                            borderRadius: "10px",
                            border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                            p: "5px",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="file"
                            style={{ display: "none" }}
                            id={inputId}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file ?? undefined);
                              e.target.value = "";
                            }}
                          />

                          <Box
                            component="label"
                            htmlFor={inputId}
                            sx={{
                              height: "100%",
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
                              <img src={image} alt="Ảnh thuộc tính" />
                            ) : (
                              <FileUploadIcon fontSize="large" sx={{ fontSize: "20px" }} />
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
                                ":hover": { backgroundColor: "error.main" },
                              }}
                              onClick={() => {
                                const prevList = getValues("listAttributeValue");
                                const newList = prevList?.map((item, idx) => {
                                  if (idx == index) {
                                    return {
                                      ...item,
                                      imageDelete: true,
                                      image: undefined,
                                    };
                                  }
                                  return item;
                                });
                                setListAttributeValue(newList);
                                setValue(`listAttributeValue`, newList);
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      );
                    }}
                  />
                </Grid>
                <Grid size={1}>
                  {listAttributeValue.length > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => handleRemoveValue(item)}
                      sx={{
                        height: "100%",
                        backgroundColor: "error.main",
                        color: "#fff",
                        fontSize: "1.6rem",
                      }}
                    >
                      X
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/product/attributes")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Thuộc Tính
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
