import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment } from "react/jsx-runtime";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import axiosClient from "~/hooks/useFetch";
import { BackDropContext } from "~/context/BackDrop";
import Breadcrumb from "~/components/Breadcrumb";
import type CategoryTree from "~/types/categoryTree";
import flattenCategory from "~/utils/flattenCategory";
import type Brand from "~/types/brand";
import TinyMCE from "~/components/TinyMCE";
import type Attribute from "~/types/attribute";
import ConfirmModel from "~/components/ConfirmModel";
import getLastError from "~/utils/onErrorValidate";
import formatToLocalDateTime from "~/utils/formatToLocalDateTime";
import type { SelectedAttributeType } from "./create";
import schema from "~/schemas/productSchema";
import type Variant from "~/types/variant";

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/products",
  },
  {
    title: "Chỉnh Sửa Sản Phẩm",
    url: "/product/edit",
  },
];

function handleListOption(listAttribute: Attribute[]) {
  return listAttribute.map((item) => {
    return {
      label: item.name,
      id: item.id,
    };
  });
}

function Edit() {
  const [content, setContent] = useState<ReactNode>();
  const [title, setTitle] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState({});
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [listAttribute, setListAttribute] = useState<Attribute[]>([]);

  const [description, setDescription] = useState<string>("");
  const [selectedAttribute, setSelectedAttribute] = useState<{ label: string; id: number } | null>(
    null
  );
  const [listSelectedAttribute, setListSelectedAttribute] = useState<SelectedAttributeType[]>([]);
  const [listImage, setListImage] = useState<File[]>([]);
  const [listImagePreview, setListImagePreview] = useState<string[]>([]);
  const [listDeletedImage, setListDeletedImage] = useState<string[]>([]);

  const [hasVariant, setHasVariant] = useState<boolean>(true);
  const selectAttributeRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setBackDrop } = useContext(BackDropContext);
  const { id } = useParams();

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      status: true,
      isFeatured: false,
      categoryId: "",
      brandId: "",
      variantList: [],
    },
    mode: "onBlur",
  });

  const {
    fields: variants,
    append,
    replace,
    remove,
  } = useFieldArray({
    control,
    name: "variantList",
  });
  const navigate = useNavigate();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [product, tree, brand, attribute] = await Promise.all([
          axiosClient.get("/product/" + id),
          axiosClient.get("http://localhost:8081/fashion-store/api/category/getTree"),
          axiosClient.get("/brand"),
          axiosClient.get("/attribute"),
        ]);

        if (tree.data.code == 1000) {
          const value = flattenCategory(tree.data.result, 0);
          setCategoryTree(value);
        } else if (tree.data.code != 9401 || tree.data.code != 9400) {
          toast(tree.data.result.message);
        }

        if (brand.data.code == 1000) {
          setBrandList(brand.data.result);
        } else if (brand.data.code != 9401 || brand.data.code != 9400) {
          toast(brand.data.result.message);
        }

        if (attribute.data.code == 1000) {
          setListAttribute(attribute.data.result);
        } else if (attribute.data.code != 9401 || attribute.data.code != 9400) {
          toast(attribute.data.result.message);
        }

        if (product.data.code === 1000) {
          const data = product.data.result;
          setValue("name", data.name);
          setValue("status", data.status);
          setValue("categoryId", data.categoryId);
          setValue("brandId", data.brandId);
          setValue("isFeatured", data.isFeatured);
          setDescription(data.description);
          setListImagePreview(data.productImages);
          setHasVariant(data.variants.length > 1);

          let initListSelected: SelectedAttributeType[] = [];
          const listVariant = data.variants?.map((variant: Variant) => {
            // hiển thị attribute và check value đã được chọn trước đó
            variant.attributeValues.forEach((attrV) => {
              let existed = initListSelected.find((item) => item.id === attrV.attributeId);
              if (existed) {
                const newList = initListSelected.map((item) => {
                  if (item.id === existed.id) {
                    return {
                      id: item.id,
                      atrV: [
                        ...item.atrV,
                        {
                          id: attrV.id,
                          value: attrV.value,
                        },
                      ],
                    };
                  }
                  return item;
                });
                initListSelected = newList;
              } else {
                initListSelected = [
                  ...initListSelected,
                  {
                    id: attrV.attributeId,
                    atrV: [
                      {
                        id: attrV.id,
                        value: attrV.value,
                      },
                    ],
                  },
                ];
              }
            });
            // end

            return {
              id: variant?.id,
              value: variant?.attributeValues.map((item) => item.value).join("-") || "",
              sku: variant?.sku || "",
              originalPrice: variant?.originalPrice,
              salePrice: variant?.salePrice,
              promotionalPrice: variant?.promotionalPrice,
              promotionStartTime: variant?.promotionStartTime
                ? dayjs(variant.promotionStartTime)
                : undefined,
              promotionEndTime: variant?.promotionEndTime
                ? dayjs(variant.promotionEndTime)
                : undefined,
              inventory: variant?.inventory,
              attributeValue: variant?.attributeValues.map((item) => item.id) || [],
            };
          });
          setListSelectedAttribute(initListSelected);

          replace(listVariant);

          if (
            (listVariant.length === 1 && listVariant[0].attributeValue == null) ||
            listVariant[0].attributeValue.length === 0
          ) {
            setHasVariant(false);
          } else {
            setHasVariant(true);
          }
        }
      } catch (error: any) {
        toast.error("Tải dử liệu không thành công! vui lòng reload lại trang hoặc thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleChangeFile(e: any) {
    let list: File[] = Array.from(e.target.files);
    if (list.length + listImage.length > 12) {
      list = list.slice(0, 12 - listImage.length);
      setListImage((prev) => [...prev, ...list]);
      toast.warning("Bạn chỉ có thể tải lên tối đa 12 ảnh!");
    } else {
      setListImage((prev) => [...prev, ...list]);
    }
    e.target.value = "";
  }

  function handleRemoveImage(file: File) {
    setListImage((listFile) => {
      return listFile.filter((item) => item != file);
    });
  }

  function handleRemoveImagePreview(url: string) {
    setListDeletedImage([...listDeletedImage, url]);
    setListImagePreview((listFile) => {
      return listFile.filter((item) => item != url);
    });
  }

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    if (hasVariant && variants.length === 0) {
      toast.error("Phải có ít nhất 1 biến thể!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append(`name`, data.name);
      formData.append(`status`, data.status);
      formData.append(`isFeatured`, data.isFeatured);
      listDeletedImage.forEach((item) => {
        formData.append(`listDeletedImage`, item);
      });

      if (data.brandId) formData.append(`brandId`, data.brandId);

      if (data.categoryId) formData.append(`categoryId`, data.categoryId);

      formData.append(`description`, description);

      listImage.forEach((file) => {
        formData.append("images", file);
      });

      data.variantList.forEach((item: any, index: number) => {
        if (item) {
          if (item.id) {
            formData.append(`variantList[${index}].id`, item.id);
          }
          formData.append(`variantList[${index}].sku`, item.sku);
          formData.append(`variantList[${index}].inventory`, item.inventory || 0);
          formData.append(`variantList[${index}].originalPrice`, item.originalPrice || 0);
          formData.append(`variantList[${index}].salePrice`, item.salePrice || 0);

          if (item.attributeValue)
            formData.append(`variantList[${index}].AttributeValue`, item.attributeValue);

          if (item.promotionalPrice) {
            formData.append(`variantList[${index}].promotionalPrice`, item.promotionalPrice);
            if (item.promotionStartTime) {
              formData.append(
                `variantList[${index}].promotionStartTime`,
                formatToLocalDateTime(item.promotionStartTime)
              );
            }
            if (item.promotionEndTime) {
              formData.append(
                `variantList[${index}].promotionEndTime`,
                formatToLocalDateTime(item.promotionEndTime)
              );
            }
          }
        }
      });

      const res = await axiosClient.put("/product/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.code == 1000) {
        navigate("/products", { state: { message: res.data.message } });
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

  function handleAddAttribute() {
    if (selectedAttribute) {
      if (listSelectedAttribute.find((item) => item.id == selectedAttribute.id)) {
        toast.warning("Thuộc tính này đã được chọn trước đó!");
        return;
      }
      setListSelectedAttribute([...listSelectedAttribute, { id: selectedAttribute.id, atrV: [] }]);
      setSelectedAttribute(null);
    } else {
      toast.warning("Vui Lòng chọn thuộc tính!");
    }
  }

  function handleCheckValue(
    event: React.ChangeEvent<HTMLInputElement>,
    atrId: number,
    artV: {
      value: string;
      id: number;
    }
  ) {
    setListSelectedAttribute((prev) => {
      return prev.map((atr) => {
        if (atr.id === atrId) {
          let newAtrV = atr.atrV;
          if (event.target.checked) {
            newAtrV = [
              ...newAtrV,
              {
                value: artV.value,
                id: artV.id,
              },
            ];
          } else {
            newAtrV = atr.atrV.filter((v) => v.id !== artV.id);
          }
          return { ...atr, atrV: newAtrV };
        }
        return atr;
      });
    });
  }

  function handleRemoveAttribute(id: number) {
    setListSelectedAttribute((prev) => {
      return prev.filter((item) => item.id != id);
    });
  }

  function handleCreateListVariant() {
    let listVariantAttributeValue: { value: string; listId: number[] }[] = [];
    if (listSelectedAttribute.length === 0) {
      toast.warning("Vui lòng thêm thuộc tính trước khi tạo danh sách!");
      return;
    }
    listSelectedAttribute.forEach((atr) => {
      let tmpList: { value: string; listId: number[] }[] = [];
      atr.atrV.forEach((attributeValue) => {
        if (listVariantAttributeValue.length != 0) {
          listVariantAttributeValue.map((v) => {
            tmpList.push({
              value: v.value + "-" + attributeValue.value,
              listId: [...v.listId, attributeValue.id],
            });
          });
        } else {
          tmpList.push({
            value: attributeValue.value,
            listId: [attributeValue.id],
          });
        }
      });
      listVariantAttributeValue = tmpList;
    });
    const listVariant = listVariantAttributeValue.map((attributeValue) => {
      return {
        value: attributeValue.value,
        sku: "",
        originalPrice: 0,
        salePrice: 0,
        promotionalPrice: 0,
        promotionStartTime: undefined,
        promotionEndTime: undefined,
        inventory: 0,
        attributeValue: attributeValue.listId,
      };
    });
    if (listVariant.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 giá trị thuộc tính trước khi tạo danh sách!");
      return;
    } else {
      append(listVariant);
    }
    setValue("variantList", listVariant);
  }

  function handleConfirm({
    createVariant,
    changeVariantType,
  }: {
    createVariant?: boolean;
    changeVariantType?: boolean;
  }) {
    if (createVariant) {
      handleCreateListVariant();
    } else if (changeVariantType) {
      setValue("variantList", []);
      setHasVariant(!hasVariant);
    }
    setConfirmAction({});
    setOpen(false);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Chỉnh Sửa Sản Phẩm" />
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
            }}
            container
            spacing={3}
          >
            <Grid size={{ md: 9, sm: 12 }} container>
              <Grid size={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Tên sản phẩm"
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
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel shrink id="demo-simple-select-label">
                        Danh Mục
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        displayEmpty
                        label={"Danh Mục"}
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
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel shrink id="demo-simple-select-label">
                        Thương Hiệu
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        displayEmpty
                        label={"Thương Hiệu"}
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="">Không chọn</MenuItem>
                        {brandList.map((item) => (
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

                <Controller
                  name="isFeatured"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" variant="standard">
                      <Typography>Sản Phẩm Nổi Bật</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              color="success"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label={field.value ? "Có" : "Không"}
                        />
                      </FormGroup>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            <Grid size={{ md: 3, sm: 12 }} spacing={1} sx={{ width: "100%", mt: "16px " }}>
              <Grid container spacing={1}>
                {listImagePreview.length + listImage.length < 12 && (
                  <>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleChangeFile}
                    />
                    <Grid
                      size={4}
                      sx={{
                        border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                        aspectRatio: "1/1",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                      component={"label"}
                      htmlFor="images"
                    >
                      <FileUploadIcon
                        fontSize="large"
                        sx={{
                          fontSize: {
                            sm: "50px",
                            md: "30px",
                          },
                        }}
                      />
                      <Typography variant="body2">
                        {listImagePreview.length + listImage.length}/12 ảnh
                      </Typography>
                    </Grid>
                  </>
                )}
                {listImagePreview.map((img, index) => (
                  <Grid
                    key={index}
                    size={4}
                    sx={{
                      aspectRatio: "1/1",
                      border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      position: "relative",
                      p: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "-2%",
                        right: "-2%",
                        backgroundColor: "error.main",
                        "& .MuiSvgIcon-root": {
                          color: "#fff ",
                        },
                        ":hover": {
                          backgroundColor: "error.main",
                        },
                      }}
                      onClick={() => handleRemoveImagePreview(img)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "& img": {
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        },
                      }}
                    >
                      <img src={img} alt="Ảnh sản phẩm" />
                    </Box>
                  </Grid>
                ))}
                {listImage.map((img, index) => (
                  <Grid
                    key={index}
                    size={4}
                    sx={{
                      aspectRatio: "1/1",
                      border: (theme) => `1px dashed ${theme.palette.text.primary}`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "5px",
                      position: "relative",
                      p: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "-2%",
                        right: "-2%",
                        backgroundColor: "error.main",
                        "& .MuiSvgIcon-root": {
                          color: "#fff ",
                        },
                        ":hover": {
                          backgroundColor: "error.main",
                        },
                      }}
                      onClick={() => handleRemoveImage(img)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "& img": {
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        },
                      }}
                    >
                      <img src={URL.createObjectURL(img)} alt="Ảnh sản phẩm" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* cài đặc biến thể */}
          <Box mt={3}>
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      checked={hasVariant}
                      onChange={() => {
                        if (variants && variants.length > 0) {
                          setTitle("Cài Đặt Biến Thể");
                          setContent(
                            "Dữ liệu biến thể đã nhập trước đó sẽ không thể khôi phục. Bạn chắc muốn chuyển đổi không"
                          );
                          setOpen(true);
                          setConfirmAction({ changeVariantType: true });
                        } else {
                          setHasVariant(!hasVariant);
                        }
                      }}
                      name="variant"
                    />
                  }
                  label={hasVariant ? "Sản phẩm có biến thể" : "Sản phẩm không có biến thể"}
                />
              </FormGroup>
            </FormControl>
          </Box>

          <Box
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 1,
              p: 2,
            }}
          >
            {/* không có biến thể */}
            {!hasVariant && (
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Controller
                    name="variantList.0.sku"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        id="outlined-required"
                        label="Mã sản phẩm (SKU)"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="variantList.0.originalPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        id="outlined-required"
                        label="Giá Gốc"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="variantList.0.salePrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        id="outlined-required"
                        label="Giá Bán"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="variantList.0.promotionalPrice"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        id="outlined-required"
                        label="Giá Khuyến Mãi"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="variantList.0.inventory"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        id="outlined-required"
                        label="Sẳn Có"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                {variants && variants[0]?.promotionalPrice && (
                  <Fragment>
                    <Grid size={6}>
                      <Controller
                        name="variantList.0.promotionStartTime"
                        control={control}
                        render={({ field, fieldState }) => (
                          <DatePicker
                            label="Ngày khuyến mãi"
                            value={field.value || null}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{
                              textField: {
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                                fullWidth: true,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={6}>
                      <Controller
                        name="variantList.0.promotionEndTime"
                        control={control}
                        render={({ field, fieldState }) => (
                          <DatePicker
                            label="Ngày khuyến mãi"
                            value={field.value || null}
                            onChange={(newValue) => field.onChange(newValue)}
                            slotProps={{
                              textField: {
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                                fullWidth: true,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Fragment>
                )}
              </Grid>
            )}

            {/* cài đặc danh sách biến thể */}
            {hasVariant && (
              <>
                <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: "10px" }}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    options={handleListOption(listAttribute)}
                    value={selectedAttribute}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => setSelectedAttribute(value)}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        inputRef={selectAttributeRef}
                        {...params}
                        label="Chọn thuộc tính"
                      />
                    )}
                  />
                  <Button onClick={handleAddAttribute} variant="outlined">
                    Thêm thuộc tính
                  </Button>
                  <Button
                    onClick={() => {
                      if (variants && variants.length > 0) {
                        setTitle("Tạo Danh Sách Biến Thể");
                        setContent(
                          "Dữ liệu biến thể đã nhập trước đó sẽ không thể khôi phục. Bạn chắc muốn chuyển đổi không"
                        );
                        setOpen(true);
                        setConfirmAction({ createVariant: true });
                      } else {
                        handleCreateListVariant();
                      }
                    }}
                  >
                    Tạo danh sách biến thể
                  </Button>
                </Box>
                {listSelectedAttribute && listSelectedAttribute.length > 0 && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableBody>
                        {listSelectedAttribute.map((item) => {
                          const atr = listAttribute.find((atr) => atr.id === item.id);
                          return (
                            <TableRow
                              key={item.id}
                              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              <TableCell sx={{ whiteSpace: "nowrap" }}>{atr?.name}</TableCell>
                              <TableCell>
                                <Box sx={{ width: "100%", display: "flex" }}>
                                  {atr?.listAttributeValue.map((atrValue) => {
                                    return (
                                      <FormControlLabel
                                        key={atrValue.id}
                                        control={
                                          <Checkbox
                                            onChange={(e) =>
                                              handleCheckValue(e, atr.id, {
                                                id: atrValue.id,
                                                value: atrValue.value,
                                              })
                                            }
                                            checked={listSelectedAttribute.some((attr) => {
                                              return attr.atrV.some(
                                                (item) => item.id === atrValue.id
                                              );
                                            })}
                                            size="large"
                                            sx={{
                                              "& .MuiSvgIcon-root": {
                                                color: "text.secondary",
                                              },
                                            }}
                                          />
                                        }
                                        label={atrValue.value}
                                      />
                                    );
                                  })}
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  onClick={() => handleRemoveAttribute(item.id)}
                                  sx={{
                                    bgcolor: "error.main",
                                    "& .MuiSvgIcon-root": {
                                      color: "#fff",
                                    },
                                  }}
                                >
                                  <CloseIcon></CloseIcon>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}

            {/* bảng danh sách biến thể */}
            {hasVariant && variants?.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá trị</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Mã sản phẩm (Sku)</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Tồn kho</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá gốc</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá bán</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá khuyến mãi</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Bắt đầu KM</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Kết thúc KM</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variants.map((item, idx) => {
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{item.value}</TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`variantList.${idx}.sku`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`variantList.${idx}.inventory`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`variantList.${idx}.originalPrice`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`variantList.${idx}.salePrice`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`variantList.${idx}.promotionalPrice`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  size="small"
                                  {...field}
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`variantList.${idx}.promotionStartTime`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <DatePicker
                                  value={field.value || null}
                                  onChange={(newValue) => field.onChange(newValue)}
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      error: !!fieldState.error,
                                      helperText: fieldState.error?.message,
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`variantList.${idx}.promotionEndTime`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <DatePicker
                                  value={field.value || null}
                                  onChange={(newValue) => field.onChange(newValue)}
                                  slotProps={{
                                    textField: {
                                      size: "small",
                                      error: !!fieldState.error,
                                      helperText: fieldState.error?.message,
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => remove(idx)}
                              sx={{
                                bgcolor: "error.main",
                                "& .MuiSvgIcon-root": {
                                  color: "#fff",
                                },
                              }}
                            >
                              <CloseIcon></CloseIcon>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Typography variant="h2" mt={3}>
            Mô Tả Sản Phẩm
          </Typography>
          <Box
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 2,
              p: 2,
            }}
          >
            <TinyMCE desc={description} setDesc={setDescription} />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/products")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Sản Phẩm
            </Button>
          </Box>
        </form>
      )}
      <ConfirmModel
        title={title}
        content={content}
        open={open}
        setOpen={setOpen}
        handleSubmit={() => handleConfirm(confirmAction)}
      />
    </Fragment>
  );
}

export default Edit;
