import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
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

import { BackDropContext } from "~/admin/context/BackDrop";
import { createSchema as schema } from "~/admin/schemas/orderSchema";
import Breadcrumb from "~/admin/components/Breadcrumb";
import getLastError from "~/utils/onErrorValidate";
import axiosClient from "~/admin/hooks/useFetch";
import DefaultImage from "~/assets/images/default-image.png";
import Autocomplete from "@mui/material/Autocomplete";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import type Voucher from "~/admin/types/voucher";
import type { customerOption, voucherOption, productOption } from "./type";
const API_PATH = import.meta.env.VITE_API_PATH;

const listBreadcrumb = [
  {
    title: "Đơn Hàng",
    url: "/admin/orders",
  },
  {
    title: "Tạo Mới Đơn Hàng",
    url: "/admin/order/create",
  },
];

function Create() {
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const [listProductOption, setListProductOption] = useState<productOption[]>([]);
  const [listCustomerOption, setListCustomerOption] = useState<customerOption[]>([]);
  const [listVoucherOption, setListVoucherOption] = useState<voucherOption[]>([]);
  const [provinces, setProvinces] = useState<{ label: string; code: number }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; code: number }[]>([]);
  const [wards, setWards] = useState<{ label: string; code: number }[]>([]);
  const customerInputRef = useRef<HTMLButtonElement>(null);
  const productInputRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState({
    customer: false,
    voucher: false,
    product: false,
  });
  const [loading, setLoading] = useState({
    global: false,
    product: false,
    customer: false,
    voucher: false,
  });
  const prevOpen = useRef(open);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      orderItems: [],
      paymentMethod: "COD",
      isPaid: false,
      voucherId: null,
    },
  });

  const {
    fields: orderItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "orderItems",
  });

  const rowValues = useWatch({
    control,
    name: `orderItems`,
  });

  const orderItemsWatch = useWatch({
    control,
    name: "orderItems",
  });

  const voucherId = useWatch({
    control,
    name: `voucherId`,
  });

  useEffect(() => {
    if (prevOpen.current.customer === true && open.customer === false) {
      customerInputRef.current?.focus();
    }
    if (prevOpen.current.product === true && open.product === false) {
      productInputRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, global: true }));
        const provinces = await axiosClient.get(`${API_PATH}/address/provinces`);
        if (provinces.data) {
          setProvinces(provinces.data.map((item: any) => ({ code: item.code, label: item.name })));
        } else if (provinces.data.code != 9401 || provinces.data.code != 9400) {
          toast(provinces.data.result.message);
        }
      } catch (error: any) {
        toast.error("Tải dử liệu không thành công! vui lòng reload lại trang hoặc thử lại sau!");
      } finally {
        setLoading((prev) => ({ ...prev, global: false }));
      }
    };

    fetchData();
  }, []);

  function handleAddProduct(sku: string) {
    const existed = orderItems.some((item) => item.sku === sku);
    if (existed) {
      toast.warning("Sản phẩm đã được chọn trước đó!");
      return;
    }
    const variant = listProductOption.find((item) => item.sku == sku);
    append({
      sku: sku,
      name: variant?.name,
      price: variant?.price,
      value: variant?.value,
      quantity: 1,
    });
    setOpen((prev) => ({ ...prev, product: false }));
  }

  function handleAddCustomer(customerId: string) {
    const customer = listCustomerOption.find((item) => item.id === customerId);
    if (customer != null) {
      setValue("phone", customer.phone);
      setValue("customerName", customer.fullName);
      setValue("customerId", customer.id);
    }
    setOpen((prev) => ({ ...prev, customer: !prev.customer }));
  }

  const fetchProductData = async (value: string) => {
    setLoading((prev) => ({ ...prev, product: true }));
    try {
      const listProduct = (await axiosClient("/product?name=" + value)).data.result;
      let newListOption: productOption[] = [];
      listProduct.forEach((item: any) => {
        item.variants.forEach((variant: any) => {
          const start = new Date(variant.promotionStartTime).getTime();
          const end = new Date(variant.promotionEndTime).getTime();
          const now = Date.now();

          const price =
            variant.promotionalPrice && start <= now && end >= now
              ? variant.promotionalPrice
              : variant.salePrice;

          newListOption.push({
            id: item.id,
            sku: variant.sku,
            name: item.name,
            image: item.productImages[0] || DefaultImage,
            inventory: variant.inventory,
            price: price,
            value: variant.attributeValues.map((attrV: any) => attrV.value).join("-") || "-",
          });
        });
      });
      setListProductOption(newListOption);
    } catch (error) {
      toast.warning("lỗi: k tải được sản phẩm ");
    }
    setLoading((prev) => ({ ...prev, product: false }));
    setOpen((prev) => ({ ...prev, product: true }));
  };

  const fetchCustomerData = async (value: string) => {
    setLoading((prev) => ({ ...prev, customer: true }));
    try {
    } catch (error) {}
    const listCustomer = (await axiosClient("/customer?name=" + value)).data.result;
    let newListOption: customerOption[] = [];
    listCustomer.forEach((item: any) => {
      newListOption.push({
        id: item.id,
        fullName: item.fullName,
        phone: item.phone || "",
        avatar: item.avatar || DefaultImage,
      });
    });
    setLoading((prev) => ({ ...prev, customer: false }));
    setListCustomerOption(newListOption);
    setOpen((prev) => ({ ...prev, customer: true }));
  };

  const fetchVoucherData = async (value: string) => {
    setLoading((prev) => ({ ...prev, voucher: true }));
    try {
      const listVoucher = (await axiosClient("/voucher?search=" + value)).data.result;
      let newListOption: voucherOption[] = [];
      listVoucher.forEach((item: Voucher) => {
        const start = new Date(item.startDate).getTime();
        const end = new Date(item.endDate).getTime();
        const now = Date.now();
        if (start <= now && end >= now) {
          newListOption.push({
            id: item.id,
            name: item.name,
            code: item.code,
            discountValue: item.discountValue,
            minOrderValue: item.minOrderValue,
            maxDiscountValue: item.maxDiscountValue,
            discountType: item.discountType,
          });
        }
      });
      setListVoucherOption(newListOption);
    } catch (error) {}
    setLoading((prev) => ({ ...prev, voucher: false }));
    setOpen((prev) => ({ ...prev, voucher: true }));
  };

  const debouncedFetchProduct = useMemo(() => debounce(fetchProductData, 500), []);
  const debouncedFetchCustomer = useMemo(() => debounce(fetchCustomerData, 500), []);
  const debouncedFetchVoucher = useMemo(() => debounce(fetchVoucherData, 500), []);

  const handleToggle = (key: string) => {
    switch (key) {
      case "customer":
        setOpen((prev) => ({ ...prev, customer: !prev.customer }));
        break;
      case "voucher":
        setOpen((prev) => ({ ...prev, voucher: !prev.voucher }));
        break;
      case "product":
        setOpen((prev) => ({ ...prev, product: !prev.product }));
        break;
      default:
        break;
    }
  };

  const handleClose = (event: Event | React.SyntheticEvent, key: string) => {
    switch (key) {
      case "customer":
        if (
          customerInputRef.current &&
          customerInputRef.current.contains(event.target as HTMLElement)
        ) {
          return;
        }
        setOpen((prev) => ({ ...prev, customer: false }));
        break;
      case "product":
        if (
          productInputRef.current &&
          productInputRef.current.contains(event.target as HTMLElement)
        ) {
          return;
        }
        setOpen((prev) => ({ ...prev, product: false }));
        break;
      default:
        break;
    }
  };

  function handleListKeyDown(event: React.KeyboardEvent, key: string) {
    if (event.key === "Tab") {
      event.preventDefault();
      switch (key) {
        case "customer":
          setOpen((prev) => ({ ...prev, customer: false }));
          break;
        case "voucher":
          setOpen((prev) => ({ ...prev, voucher: false }));
          break;
        case "product":
          setOpen((prev) => ({ ...prev, product: false }));
          break;
        default:
          break;
      }
    } else if (event.key === "Escape") {
      switch (key) {
        case "customer":
          setOpen((prev) => ({ ...prev, customer: false }));
          break;
        case "voucher":
          setOpen((prev) => ({ ...prev, voucher: false }));
          break;
        case "product":
          setOpen((prev) => ({ ...prev, product: false }));
          break;
        default:
          break;
      }
    }
  }

  async function handleSelectCity(code: number | undefined) {
    try {
      if (code) {
        const districtList = (await axiosClient.get(`${API_PATH}/address/districts/${code}`)).data;
        setDistricts(
          districtList.districts.map((item: any) => ({ code: item.code, label: item.name }))
        );
      } else {
        toast.error("Tải dử liệu Quận/Huyện thất bại!");
      }
    } catch (error) {
      toast.error("Tải dử liệu Quận/Huyện thất bại!");
    }
  }
  async function handleSelectDistrict(code: number | undefined) {
    try {
      if (code) {
        const wardList = (await axiosClient.get(`${API_PATH}/address/wards/${code}`)).data;
        setWards(wardList.wards.map((item: any) => ({ code: item.code, label: item.name })));
      } else {
        toast.error("Tải dử liệu Quận/Huyện thất bại!");
      }
    } catch (error) {
      toast.error("Tải dử liệu Quận/Huyện thất bại!");
    }
  }

  const priceInfo = useMemo(() => {
    const total = (orderItemsWatch ?? []).reduce((total, item) => {
      if (item.price) {
        return item.price * item.quantity + total;
      }
      return total;
    }, 0);
    const voucher = listVoucherOption.find((item) => item.id === voucherId);
    let discount = 0;
    if (voucher?.minOrderValue != null && total >= voucher.minOrderValue) {
      if (voucher.discountType === "PERCENT") {
        discount = total * (voucher.discountValue / 100);
      } else {
        discount = voucher.discountValue;
      }

      if (discount < 0) {
        discount = 0;
      } else if (discount > voucher.maxDiscountValue) {
        discount = voucher.maxDiscountValue;
      }
    }
    let finalPrice = total - discount;
    if (finalPrice < 0) {
      finalPrice = 0;
    }
    return {
      total,
      discount,
      finalPrice,
    };
  }, [orderItemsWatch, voucherId]);

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const res = await axiosClient.post("/order", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/admin/orders", { state: { message: res.data.message } });
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tạo Phiếp Nhập" />
      {loading.global && (
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

      {!loading.global && (
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
            spacing={3}
          >
            <Grid size={12}>
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
                    Tìm kiếm khách hàng
                  </InputLabel>
                  <OutlinedInput
                    onChange={(e) => debouncedFetchCustomer(e.currentTarget.value)}
                    inputRef={customerInputRef}
                    id="outlined-adornment-search"
                    aria-controls={open ? "composition-menu-customer" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={() => handleToggle("customer")}
                    autoComplete="off"
                    fullWidth
                    sx={{
                      pr: "5px",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        {loading.customer ? (
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
                {customerInputRef?.current?.value != "" && (
                  <Popper
                    open={open.customer}
                    anchorEl={customerInputRef.current}
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
                          transformOrigin:
                            placement === "bottom-start" ? "left top" : "left bottom",
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={(e) => handleClose(e, "customer")}>
                            <MenuList
                              autoFocusItem={open.customer}
                              id="composition-menu-customer"
                              aria-labelledby="composition-button"
                              onKeyDown={(e) => handleListKeyDown(e, "customer")}
                              sx={{
                                maxHeight: 300,
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                            >
                              {listCustomerOption.length == 0 && (
                                <Typography sx={{ padding: "0 10px" }}>
                                  Không có khách hàng nào.
                                </Typography>
                              )}
                              {listCustomerOption.length > 0 &&
                                listCustomerOption.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.id}
                                      onClick={() => handleAddCustomer(item.id)}
                                    >
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
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <img src={item.avatar} alt="ảnh khách hàng" />
                                        </Box>
                                        <Box sx={{ overflow: "hidden" }}>
                                          <Typography
                                            variant="body1"
                                            sx={{
                                              maxWidth: "100%",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {item.fullName}
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
            </Grid>
            <Grid size={6}>
              <Controller
                name={"customerName"}
                defaultValue=""
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
                    required
                    label="Tên khách hàng"
                  />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name={"phone"}
                defaultValue=""
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
                    required
                    label="Số điện thoại"
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="city"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={provinces}
                    getOptionLabel={(option) => option.label}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.code);
                      handleSelectCity(newValue?.code);
                    }}
                    value={provinces.find((option) => {
                      if (field.value) {
                        return option.code === field.value;
                      }
                      return false;
                    })}
                    renderInput={(params) => (
                      <TextField {...params} label={"Tĩnh/Thành Phố"} required />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="district"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={districts}
                    getOptionLabel={(option) => option.label}
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.code);
                      handleSelectDistrict(newValue?.code);
                    }}
                    value={districts.find((option) => {
                      if (field.value) {
                        return option.code === field.value;
                      }
                      return false;
                    })}
                    renderInput={(params) => (
                      <TextField {...params} label={"Quận/Huyện"} required />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="ward"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={wards}
                    getOptionLabel={(option) => option.label}
                    onChange={(_, newValue) => field.onChange(newValue ? newValue.code : null)}
                    value={wards.find((option) => {
                      if (field.value) {
                        return option.code === field.value;
                      }
                      return false;
                    })}
                    renderInput={(params) => <TextField {...params} label="Phường/Xã" />}
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ chi tiết"
                    variant="outlined"
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
            <Grid size={{ md: 6, sm: 12 }}>
              <Box sx={{ display: "flex", columnGap: "50px", rowGap: "20px", flexWrap: "wrap" }}>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl>
                      <FormLabel
                        id="paymentMethod"
                        sx={{
                          color: "text.primary",
                          "&.Mui-focused": {
                            color: "text.primary",
                          },
                          "&.Mui-error": {
                            color: "text.primary",
                          },
                        }}
                      >
                        Phương Thức Thanh Toán
                      </FormLabel>
                      <RadioGroup
                        {...field}
                        aria-labelledby="paymentMethod"
                        defaultValue="COD"
                        name="paymentMethod"
                        row
                      >
                        <FormControlLabel value="COD" control={<Radio />} label="COD" />
                        <FormControlLabel value="BANK" control={<Radio />} label="BANK" />
                        {fieldState.error && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {fieldState.error.message}
                          </span>
                        )}
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                <Controller
                  name="isPaid"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset" variant="standard">
                      <Typography>Thanh Toán</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              color="success"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label={field.value ? "Đã thanh toán" : "Chưa thanh toán"}
                        />
                      </FormGroup>
                    </FormControl>
                  )}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Controller
                name="voucherId"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={listVoucherOption}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}
                    value={listVoucherOption.find((option) => {
                      if (field.value) {
                        return option.code === field.name;
                      }
                      return false;
                    })}
                    loading={loading.voucher}
                    loadingText="Đang tải..."
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nhập tên hoặc mã voucher"
                        onChange={(e) => debouncedFetchVoucher(e.currentTarget.value)}
                      />
                    )}
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
              <FormControl sx={{ width: "100%" }} variant="outlined" size="small">
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
                  onChange={(e) => debouncedFetchProduct(e.currentTarget.value)}
                  inputRef={productInputRef}
                  id="composition-button-search"
                  aria-controls={open ? "composition-menu-product" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={() => handleToggle("product")}
                  autoComplete="off"
                  fullWidth
                  sx={{
                    pr: "5px",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {loading.product ? (
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
              {productInputRef?.current?.value != "" && (
                <Popper
                  open={open.product}
                  anchorEl={productInputRef.current}
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
                        <ClickAwayListener onClickAway={(e) => handleClose(e, "product")}>
                          <MenuList
                            autoFocusItem={open.product}
                            id="composition-menu-product"
                            aria-labelledby="composition-button-search"
                            onKeyDown={(e: React.KeyboardEvent) => handleListKeyDown(e, "product")}
                            sx={{
                              maxHeight: 300,
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {listProductOption.length == 0 && (
                              <Typography sx={{ padding: "0 10px" }}>
                                Không có sản phẩm nào.
                              </Typography>
                            )}
                            {listProductOption.length > 0 &&
                              listProductOption.map((item) => {
                                return (
                                  <MenuItem
                                    onClick={() => handleAddProduct(item.sku)}
                                    key={item.sku}
                                  >
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
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <img src={item.image} alt="ảnh sản phẩm" />
                                      </Box>
                                      <Box sx={{ overflow: "hidden" }}>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            maxWidth: "100%",
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

            {orderItems && orderItems.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Sku</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Tên Sản phẩm</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Biến Thể</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá Bán(VNĐ)</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Số Lượng</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Thành tiền</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item, idx) => {
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
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`orderItems.${idx}.sku`}
                              control={control}
                              render={({ field }) => (
                                <Typography variant="body1" sx={{ py: 2 }}>
                                  {field.value}
                                </Typography>
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`orderItems.${idx}.name`}
                              control={control}
                              render={({ field }) => (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    maxWidth: "200px",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {String(field.value ?? "-")}
                                </Typography>
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`orderItems.${idx}.value`}
                              control={control}
                              render={({ field }) => (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    maxWidth: "200px",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {String(field.value ?? "-")}
                                </Typography>
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`orderItems.${idx}.price`}
                              control={control}
                              render={({ field }) => (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    maxWidth: "200px",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                  }}
                                >
                                  {String(
                                    field.value
                                      ? `${Number(field.value).toLocaleString("vi-VN")}đ`
                                      : "-"
                                  )}
                                </Typography>
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Controller
                              name={`orderItems.${idx}.quantity`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  variant="outlined"
                                  margin="normal"
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  sx={{ width: "100px", m: 0 }}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {(() => {
                              if (rowValues && rowValues[idx]) {
                                const { quantity, price } = rowValues[idx];

                                const total = (Number(quantity) || 0) * (Number(price) || 0);

                                return (
                                  <Typography variant="body1">
                                    {total.toLocaleString("vi-VN")}đ
                                  </Typography>
                                );
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
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="body1">Tổng Cộng:</Typography>
                        <Typography variant="body1">Giảm giá:</Typography>
                        <Typography variant="body1">Thành Tiền:</Typography>
                      </TableCell>
                      <TableCell colSpan={5}>
                        <Typography variant="body1">
                          {priceInfo.total.toLocaleString("vi-VN")}đ
                        </Typography>
                        <Typography variant="body1">
                          -{priceInfo.discount.toLocaleString("vi-VN")}đ
                        </Typography>
                        <Typography variant="body1">
                          {priceInfo.finalPrice.toLocaleString("vi-VN")}đ
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/admin/orders")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Tạo Đơn Hàng
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Create;
