import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useWatch } from "react-hook-form";
import debounce from "lodash.debounce";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TableContainer from "@mui/material/TableContainer";
import OutlinedInput from "@mui/material/OutlinedInput";

import { BackDropContext } from "~/context/BackDrop";
import { createSchema as schema } from "~/schemas/importReceiptSchema";
import type Supplier from "~/types/supplier";
import Breadcrumb from "~/components/Breadcrumb";
import getLastError from "~/utils/onErrorValidate";
import axiosClient from "~/hooks/useFetch";
import DefaultImage from "~/assets/images/default-image.png";
import formatToLocalDateTime from "~/utils/formatToLocalDateTime";

const listBreadcrumb = [
  {
    title: "Phiếu nhập",
    url: "/product/import-receipts",
  },
  {
    title: "Tạo Phiếu nhập",
    url: "/import-receipt/create",
  },
];

function Create() {
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [listOption, setListOption] = useState<
    {
      sku: string;
      name: string;
      image: string;
      inventory: number;
      value: string;
    }[]
  >([]);
  const [loadProduct, setLoadProduct] = useState<boolean>(false);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      importItemList: [],
    },
  });

  const {
    fields: importItemList,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "importItemList",
  });
  const rowValues = useWatch({
    control,
    name: `importItemList`,
  });

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supplier = await axiosClient.get("/supplier");
        if (supplier.data.code == 1000) {
          setSupplierList(supplier.data.result);
        } else if (supplier.data.code != 9401 || supplier.data.code != 9400) {
          toast(supplier.data.result.message);
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
    setBackDrop(true);
    try {
      const payload = {
        supplierId: data.supplierId,
        importDate: data.importDate ? formatToLocalDateTime(data.importDate) : null,
        note: data.note,
        importItemList: data.importItemList.map((item: any) => ({
          sku: item.sku,
          quantity: item.quantity,
          importPrice: item.importPrice,
          discountAmount: item.discountAmount,
        })),
      };

      const res = await axiosClient.post("/import-receipt", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/product/import-receipts", { state: { message: res.data.message } });
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

  const fetchProductData = async (value: string) => {
    setLoadProduct(true);
    try {
    } catch (error) {}
    const listProduct = (await axiosClient("/product?name=" + value)).data.result;
    let newListOption: {
      sku: string;
      name: string;
      image: string;
      inventory: number;
      value: string;
    }[] = [];
    listProduct.forEach((item: any) => {
      item.variants.forEach((variant: any) => {
        newListOption.push({
          sku: variant.sku,
          name: item.name,
          image: item.productImages[0] || DefaultImage,
          inventory: variant.inventory,
          value: variant.attributeValues.map((attrV: any) => attrV.value).join("-") || "-",
        });
      });
    });
    setLoadProduct(false);
    setListOption(newListOption);
    setOpen(true);
  };

  const debouncedFetch = useMemo(() => debounce(fetchProductData, 500), []);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  function handleAddValue(sku: string) {
    const existed = importItemList.some((item) => item.sku === sku);
    if (existed) {
      toast.warning("Sản phẩm đã được chọn trước đó!");
      return;
    }

    append({
      sku: sku,
      quantity: 0,
      importPrice: 0,
      discountAmount: undefined,
    });
    setOpen(false);
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Phiếp Nhập" />
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
                name="supplierId"
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
                      {supplierList.map((item) => (
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
                name="importDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Ngày nhập hàng"
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
            <Grid size={12}>
              <Controller
                name="note"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Ghi chú"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h2" mt={2}>
            Danh Sách Sản Phẩm
          </Typography>
          <Box
            sx={{
              borderRadius: "10px",
              border: (theme) => `1px dashed ${theme.palette.text.primary}`,
              mt: 1,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: "10px" }}>
              <FormControl sx={{ mb: 1, width: "100%" }} variant="outlined" size="small">
                <InputLabel
                  htmlFor="outlined-adornment-search"
                  sx={{
                    color: "text.primary",
                    bgcolor: "background.default",
                    "&.Mui-focused": {
                      color: "text.secondary",
                    },
                    p: "0 5px",
                  }}
                >
                  Tìm kiếm sản phẩm
                </InputLabel>
                <OutlinedInput
                  onChange={(e) => debouncedFetch(e.currentTarget.value)}
                  inputRef={anchorRef}
                  id="composition-button"
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                  autoComplete="off"
                  fullWidth
                  sx={{
                    pr: "5px",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {loadProduct ? (
                        <CircularProgress
                          size={15}
                          sx={{ color: "text.secondary", margin: "8px" }}
                        />
                      ) : (
                        <IconButton
                          aria-label="search"
                          sx={{
                            "&:hover svg": {
                              color: "text.secondary",
                            },
                          }}
                        >
                          <SearchIcon fontSize="medium" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  }
                ></OutlinedInput>
              </FormControl>
              {anchorRef?.current?.value != "" && (
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                  sx={{ zIndex: 10 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        width: "300px",
                        transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                            sx={{
                              maxHeight: 300,
                              overflowY: "auto",
                            }}
                          >
                            {listOption.length == 0 && (
                              <Typography sx={{ padding: "0 10px" }}>
                                Không có sản phẩm nào.
                              </Typography>
                            )}
                            {listOption.length > 0 &&
                              listOption.map((item) => {
                                return (
                                  <MenuItem onClick={() => handleAddValue(item.sku)}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        "& img": {
                                          objectFit: "contain",
                                          width: "40px",
                                          maxHeight: "30px",
                                        },
                                      }}
                                    >
                                      <img src={item.image} alt="ảnh sản phẩm" />
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            maxWidth: "100%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {item.name}
                                        </Typography>
                                        <Typography variant="body2">
                                          {` Sku: ${item.sku} | Giá trị: ${item.value} | Tồn kho:
                                        ${item.inventory}`}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </MenuItem>
                                );
                              })}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
            </Box>

            {importItemList && importItemList.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Sản phẩm</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Số lượng</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá nhập</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giảm giá</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Thành tiền</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importItemList.map((item, idx) => {
                      return (
                        <TableRow
                          key={item.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "& .MuiFormControl-root": {
                              margin: " 10px !important",
                            },
                          }}
                        >
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{item.sku}</TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`importItemList.${idx}.quantity`}
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
                              name={`importItemList.${idx}.importPrice`}
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
                              name={`importItemList.${idx}.discountAmount`}
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
                            {(() => {
                              if (rowValues && rowValues[idx]) {
                                const { quantity, importPrice, discountAmount } = rowValues[idx];

                                const total =
                                  (Number(quantity) || 0) * (Number(importPrice) || 0) -
                                  (Number(discountAmount) || 0);

                                return <Typography variant="body1">{total}</Typography>;
                              }
                              return <Typography variant="body1">-</Typography>;
                            })()}
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

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/product/import-receipts")}
            >
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Tạo Phiếu Nhập
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Create;
