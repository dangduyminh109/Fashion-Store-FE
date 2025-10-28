import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";

import PrimaryButton from "~/client/components/PrimaryButton";
import { AuthContext } from "~/client/context/AuthContext";
import type Cart from "~/client/types/cart";
import defaultImg from "~/assets/images/default-image.png";
import AuthFormContext from "~/client/context/AuthFormContext";
import getPrice from "~/utils/getPrice";
import ListVoucher from "./components/ListVoucher";
import type Voucher from "~/client/types/voucher";
import getLastError from "~/utils/onErrorValidate";
import { BackDropContext } from "~/client/context/BackDrop";
import { Controller, useForm } from "react-hook-form";
import { createSchema } from "~/client/schemas/checkoutSchema";
import type addressResponse from "~/client/types/addressResponse";
import axiosClient from "~/client/hooks/useFetch";
import { handleSelectProvince, handleSelectDistrict } from "~/utils/fetchAddress";
import { CartContext } from "~/client/context/CartContext";
import Breadcrumb from "~/client/components/Breadcrumb";

const listBreadcrumb = [
  {
    title: "Trang Chủ",
    url: "/",
  },
  {
    title: "Thanh toán",
    url: `/checkout`,
  },
];

function Checkout() {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { customer } = useContext(AuthContext);
  const { OpenAuthForm } = useContext(AuthFormContext);
  const [products, setProducts] = useState<Cart[]>([]);
  const [openVoucher, setOpenVoucher] = useState(false);
  const [listSelectProduct, setListSelectProduct] = useState<number[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [provinces, setProvinces] = useState<addressResponse[]>([]);
  const [districts, setDistricts] = useState<addressResponse[]>([]);
  const [wards, setWards] = useState<addressResponse[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);

  useEffect(() => {
    let listId: number[] = JSON.parse(localStorage.getItem("listSelectId") || "[]");
    setListSelectProduct(listId);
    let selectProduct = cart.filter((item) => {
      return listId.includes(item.variant.id);
    });
    setProducts(selectProduct);
  }, [cart]);

  useEffect(() => {
    if (customer) {
      setValue("customerName", customer.fullName);
      if (customer.addresses.length > 0) {
        let address =
          customer.addresses.find((item) => {
            if (selectedAddress) {
              return item.id === selectedAddress;
            }
            return item.isDefault === true;
          }) || customer.addresses[0];
        setSelectedAddress(address.id);
        setValue("address", address.address);
        setValue("phone", address.phone);
        setValue("cityId", address.cityId);
        setValue("districtId", address.districtId);
        setValue("wardId", address.wardId);
        handleSelectProvince(address.cityId, setLoading, setDistricts);
        handleSelectDistrict(address.districtId, setLoading, setWards);
      }
    } else {
      handleSelectProvince(1, setLoading, setDistricts);
      reset();
    }
  }, [customer, selectedAddress]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const provinces = await axiosClient.get("/address/provinces");
        if (provinces.data) {
          setProvinces(provinces.data);
        } else if (!provinces.data) {
          toast.error("Không thể nạp dử liệu Tĩnh/ Thành Phố!");
        }
      } catch (error: any) {
        toast.error("Không thể nạp dử liệu Tĩnh/ Thành Phố!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function getTotal() {
    return cart.reduce((total, item) => {
      if (listSelectProduct.includes(item.variant.id)) {
        return total + getPrice(item);
      }
      return total;
    }, 0);
  }

  function handleDiscount() {
    if (!selectedVoucher) {
      return 0;
    }
    let totalPrice = getTotal();
    let discountPrice = selectedVoucher.discountValue;
    if (selectedVoucher.discountType === "PERCENT") {
      discountPrice = totalPrice * (selectedVoucher.discountValue / 100);
    }

    if (selectedVoucher.maxDiscountValue && discountPrice > selectedVoucher.maxDiscountValue) {
      discountPrice = selectedVoucher.maxDiscountValue;
    }
    return discountPrice;
  }

  function handleFinalPrice() {
    let finalPrice = getTotal() - handleDiscount();
    if (finalPrice < 0) {
      return 0;
    }
    return finalPrice;
  }

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      cityId: 1,
      paymentMethod: "COD",
    },
  });

  const onSubmit = async (data: any) => {
    let city = provinces.find((item) => item.code == data.cityId);
    let district = districts.find((item) => item.code == data.districtId);
    let ward = wards.find((item) => item.code == data.wardId);
    if (!customer || !city || !district || !ward || products.length <= 0) {
      toast.error("Có lỗi xãy ra!");
      return;
    }
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append(`customerName`, data.name);
      formData.append(`customerId`, customer.id);
      formData.append(`address`, data.address);
      formData.append(`phone`, data.phone);
      formData.append(`cityId`, data.cityId);
      formData.append(`districtId`, data.districtId);
      formData.append(`wardId`, data.wardId);
      formData.append(`city`, city.name);
      formData.append(`district`, district.name);
      formData.append(`ward`, ward.name);
      formData.append(`paymentMethod`, data.paymentMethod);
      if (selectedVoucher) {
        formData.append(`voucherId`, String(selectedVoucher.id));
      }
      products.map((p, index) => {
        formData.append(`orderItems[${index}].sku`, p.variant.sku);
        formData.append(`orderItems[${index}].quantity`, String(p.quantity));
      });
      const res = await axiosClient.post("/order", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        if (data.paymentMethod === "BANK") window.location.href = res.data.result;
        else {
          navigate("/success");
          toast.success(res.data.message);
        }
      } else {
        toast.error("Có lỗi xãy ra!");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xãy ra!");
      }
    } finally {
      setBackDrop(false);
    }
  };

  const onError = (data: any) => {
    toast.warning(getLastError(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Breadcrumb listBreadcrumb={listBreadcrumb} />
      <Box
        component="section"
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "80%",
            margin: "0 auto",
            overflow: "auto",
            pt: 2,
            pb: 5,
          }}
        >
          <Box sx={{ mt: 4 }}>
            <Box textAlign="center">
              <CreditCardIcon sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight={600}>
                THANH TOÁN
              </Typography>
              <Typography>Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán</Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                lg: "row",
              }}
              spacing={4}
              sx={{
                mt: 5,
              }}
            >
              <Box flex={1}>
                <Typography variant="h5" fontWeight={600} sx={{ my: 1 }}>
                  Thông Tin Giao Hàng
                </Typography>
                {!customer && (
                  <Typography>
                    Bạn đã có tài khoản?
                    <Button
                      variant="text"
                      sx={{ ml: 1, color: "secondary.main" }}
                      onClick={() => OpenAuthForm()}
                    >
                      Đăng nhập
                    </Button>
                  </Typography>
                )}

                <Grid
                  container
                  spacing={2}
                  sx={{
                    "& .MuiFormLabel-root": {
                      color: "text.primary",
                    },
                    "& .MuiFormControl-root": {
                      m: 0,
                    },
                    "& *": {
                      color: "text.primary",
                    },
                    "& .MuiPaper-root": {
                      bgcolor: "Background.default",
                    },
                  }}
                >
                  {customer && customer.addresses && (
                    <Grid size={12}>
                      <FormControl fullWidth size="small">
                        <InputLabel shrink id="select-address" sx={{ color: "text.primary" }}>
                          Địa chỉ đã lưu
                        </InputLabel>
                        <Select
                          labelId="select-address"
                          label={"Địa chỉ đã lưu"}
                          displayEmpty
                          onChange={(e) => {
                            const idAddress = Number(e.target.value);
                            if (idAddress && idAddress > 0) setSelectedAddress(idAddress);
                          }}
                          value={selectedAddress}
                          inputProps={{ "aria-label": "Without label" }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: "300px",
                                backgroundColor: "background.default",
                              },
                            },
                          }}
                        >
                          <MenuItem disabled>--- Chọn Địa chỉ ---</MenuItem>
                          {customer.addresses.map((address) => {
                            return <MenuItem value={address.id}>{address.name}</MenuItem>;
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid size={12}>
                    <Controller
                      name="customerName"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          size="small"
                          {...field}
                          label="Họ tên"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          slotProps={{
                            inputLabel: {
                              shrink: !!field.value,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          size="small"
                          {...field}
                          label="Email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          slotProps={{
                            inputLabel: {
                              shrink: !!field.value,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          size="small"
                          {...field}
                          label="Số điện thoại"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          slotProps={{
                            inputLabel: {
                              shrink: !!field.value,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="cityId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel shrink id="city-label" sx={{ color: "text.primary" }}>
                            Tĩnh/Thành Phố
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="city-label"
                            displayEmpty
                            label={"Tĩnh/Thành Phố"}
                            inputProps={{ "aria-label": "Without label" }}
                            onChange={(e) => {
                              field.onChange(e);
                              handleSelectProvince(e.target.value, setLoading, setDistricts);
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: "300px",
                                  backgroundColor: "background.default",
                                },
                              },
                            }}
                          >
                            <MenuItem disabled>--- Chọn Tĩnh/Thành Phố ---</MenuItem>
                            {provinces.map((item) => (
                              <MenuItem value={item.code}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="districtId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel shrink id="district-label" sx={{ color: "text.primary" }}>
                            Quận/Huyện
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="district-label"
                            displayEmpty
                            label={" Quận/Huyện"}
                            inputProps={{ "aria-label": "Without label" }}
                            onChange={(e) => {
                              field.onChange(e);
                              handleSelectDistrict(e.target.value, setLoading, setWards);
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: "300px",
                                  backgroundColor: "background.default",
                                },
                              },
                            }}
                          >
                            <MenuItem disabled>--- Chọn Quận/Huyện ---</MenuItem>
                            {districts.map((item) => (
                              <MenuItem value={item.code}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="wardId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel shrink id="ward-label" sx={{ color: "text.primary" }}>
                            Xã/Phường
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="ward-label"
                            displayEmpty
                            label={"Xã/Phường"}
                            inputProps={{ "aria-label": "Without label" }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: "300px",
                                  backgroundColor: "background.default",
                                },
                              },
                            }}
                          >
                            <MenuItem disabled>--- Chọn Xã/Phường ---</MenuItem>
                            {wards.map((item) => (
                              <MenuItem value={item.code}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          size="small"
                          {...field}
                          label="Địa Chỉ Cụ thể"
                          variant="outlined"
                          fullWidth
                          multiline
                          minRows={3}
                          margin="normal"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          slotProps={{
                            inputLabel: {
                              shrink: !!field.value,
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
                          size="small"
                          {...field}
                          label="Ghi chú"
                          variant="outlined"
                          fullWidth
                          multiline
                          minRows={3}
                          margin="normal"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          slotProps={{
                            inputLabel: {
                              shrink: !!field.value,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Typography sx={{ mt: 3, mb: 1 }}>Phương thức vận chuyển</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "text.primary",
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      <FormControlLabel
                        control={<Radio defaultChecked />}
                        label={
                          <Stack direction="row" alignItems="center" spacing={1} width="100%">
                            <Typography flex={1}>Giao hàng tận nơi</Typography>
                            <Typography textAlign="right">0đ</Typography>
                          </Stack>
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      defaultValue="COD"
                      render={({ field }) => (
                        <FormControl component="fieldset" fullWidth size="small">
                          <Typography sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}>
                            Phương thức thanh toán
                          </Typography>

                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid",
                                borderColor:
                                  field.value === "COD" ? "primary.main" : "text.secondary",
                                borderRadius: 1,
                                p: 1,
                              }}
                            >
                              <FormControlLabel
                                value="COD"
                                control={
                                  <Radio
                                    checked={field.value === "COD"}
                                    onChange={field.onChange}
                                  />
                                }
                                label={
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <MoneyIcon
                                      sx={{ border: "1px solid #ccc", borderRadius: 1, p: 0.5 }}
                                    />
                                    <Typography>Thanh toán khi nhận hàng (COD)</Typography>
                                  </Stack>
                                }
                              />
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid",
                                borderColor:
                                  field.value === "BANK" ? "primary.main" : "text.secondary",
                                borderRadius: 1,
                                p: 1,
                              }}
                            >
                              <FormControlLabel
                                value="BANK"
                                control={
                                  <Radio
                                    checked={field.value === "BANK"}
                                    onChange={field.onChange}
                                  />
                                }
                                label={
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <AccountBalanceIcon
                                      sx={{ border: "1px solid #ccc", borderRadius: 1, p: 0.5 }}
                                    />
                                    <Typography>Chuyển khoản qua ngân hàng</Typography>
                                  </Stack>
                                }
                              />
                            </Box>
                          </Stack>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 3 }}
                >
                  <Button variant="contained" onClick={() => navigate("/cart")}>
                    Giỏ hàng
                  </Button>
                  <PrimaryButton type="submit" disabled={loading}>
                    Hoàn tất đơn hàng
                  </PrimaryButton>
                </Stack>
              </Box>

              <Box
                flex={1}
                sx={{
                  borderLeft: { lg: "1px solid #ccc" },
                  p: 2,
                  pl: { lg: 4 },
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  Giỏ hàng ({products.length})
                </Typography>

                <Stack spacing={2}>
                  {products.map(
                    (item) =>
                      listSelectProduct.includes(item.variant.id) && (
                        <Stack
                          key={item.variant.id}
                          direction="row"
                          spacing={3}
                          alignItems="center"
                          sx={{ borderBottom: "1px solid #ccc", pb: 1 }}
                        >
                          <Box position="relative">
                            <Box
                              component="img"
                              src={item.variant.product.productImages[0] || defaultImg}
                              alt="ảnh sản phẩm"
                              sx={{ width: 50, height: 50, objectFit: "contain" }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: -5,
                                right: -5,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                color: "#fff",
                              }}
                            >
                              {item.quantity}
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Link to={"/" + item.variant.product.slug}>
                              <Typography
                                sx={{
                                  fontSize: "1.6rem",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                  maxWidth: "250px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  transition: "0.3s ease",
                                  "&:hover": {
                                    color: "secondary.main",
                                  },
                                }}
                              >
                                {item.variant.product.name}
                              </Typography>
                            </Link>
                            <Typography variant="body1">
                              {item.variant.attributeValues.map((item) => item.value).join("-")}
                            </Typography>
                          </Box>
                          <Typography color="secondary">
                            {getPrice(item).toLocaleString("vi-VN")}đ
                          </Typography>
                        </Stack>
                      )
                  )}
                </Stack>

                {/* Mã giảm giá */}
                <Box>
                  <Button
                    variant="text"
                    startIcon={<LocalOfferIcon />}
                    sx={{ mt: 2, fontSize: "1.6rem" }}
                    onClick={() => setOpenVoucher(true)}
                  >
                    Chọn mã giảm giá
                  </Button>
                  <ListVoucher
                    openVoucher={openVoucher}
                    setOpenVoucher={setOpenVoucher}
                    setSelectedVoucher={setSelectedVoucher}
                    totalPrice={getTotal()}
                  />
                  {selectedVoucher && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                      <Typography>Đã chọn: </Typography>
                      <Typography
                        sx={{
                          border: "1px solid",
                          borderColor: "primary.main",
                          color: "secondary.main",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "1.4rem",
                          whiteSpace: "nowrap",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {selectedVoucher.name}
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{
                            ml: "5px",
                            height: "15px",
                            width: "15px",
                          }}
                          onClick={() => setSelectedVoucher(null)}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Table
                  size="small"
                  sx={{
                    "& *": {
                      fontSize: "1.6rem !important",
                      px: "0 !important",
                    },
                  }}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell>Tạm tính</TableCell>
                      <TableCell align="right">{getTotal().toLocaleString("vi-VN")}đ</TableCell>
                    </TableRow>
                    {selectedVoucher && (
                      <TableRow>
                        <TableCell>Mã giảm giá</TableCell>
                        <TableCell align="right">
                          - {handleDiscount().toLocaleString("vi-VN")}đ
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Phí vận chuyển</TableCell>
                      <TableCell align="right">Miễn phí</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography>Tổng cộng</Typography>
                  <Typography fontSize="1.8rem" fontWeight={600} sx={{ color: "secondary.main" }}>
                    {handleFinalPrice().toLocaleString("vi-VN")}đ
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </form>
  );
}

export default Checkout;
