import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Autocomplete from "@mui/material/Autocomplete";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

import { BackDropContext } from "~/context/BackDrop";
import { editSchema as schema } from "~/schemas/orderSchema";
import Breadcrumb from "~/components/Breadcrumb";
import getLastError from "~/utils/onErrorValidate";
import axiosClient from "~/hooks/useFetch";
const API_PATH = import.meta.env.VITE_API_PATH;

const listBreadcrumb = [
  {
    title: "Đơn Hàng",
    url: "/orders",
  },
  {
    title: "Chỉnh Sửa Đơn Hàng",
    url: "/order/edit",
  },
];

function Edit() {
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState<{ label: string; code: number }[]>([]);
  const [districts, setDistricts] = useState<{ label: string; code: number }[]>([]);
  const [wards, setWards] = useState<{ label: string; code: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      orderItems: [],
      paymentMethod: "COD",
      isPaid: false,
    },
  });

  const { fields: orderItems } = useFieldArray({
    control,
    name: "orderItems",
  });

  const { id } = useParams();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [order, provinces] = await Promise.all([
          axiosClient.get("/order/" + id),
          axiosClient.get(`${API_PATH}/address/provinces`),
        ]);

        if (order.data.code === 1000) {
          reset(order.data.result);
          const listOrderItem = order.data.result.orderItems.map((item: any) => {
            return {
              sku: item.variant.sku,
              value: item.variant.attributeValues.map((atr: any) => atr.value).join("-"),
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
            };
          });
          setValue("orderItems", listOrderItem);
          if (Number(order.data.result.city)) {
            setValue("city", Number(order.data.result.city));
          }
          if (Number(order.data.result.district)) {
            try {
              if (Number(order.data.result.district)) {
                const districtList = (
                  await axiosClient.get(
                    `${API_PATH}/address/districts/${Number(order.data.result.city)}`
                  )
                ).data;
                setValue("district", Number(order.data.result.district));
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
          if (Number(order.data.result.ward)) {
            try {
              if (Number(order.data.result.ward)) {
                const wardList = (
                  await axiosClient.get(
                    `${API_PATH}/address/wards/${Number(order.data.result.district)}`
                  )
                ).data;
                setValue("ward", Number(order.data.result.ward));
                setWards(
                  wardList.wards.map((item: any) => ({ code: item.code, label: item.name }))
                );
              } else {
                toast.error("Tải dử liệu Quận/Huyện thất bại!");
              }
            } catch (error) {
              toast.error("Tải dử liệu Quận/Huyện thất bại!");
            }
          }
        } else if (order.data.code != 9401 || order.data.code != 9400) {
          toast(order.data.result.message);
        }
        if (provinces.data) {
          setProvinces(provinces.data.map((item: any) => ({ code: item.code, label: item.name })));
        } else if (provinces.data.code != 9401 || provinces.data.code != 9400) {
          toast(provinces.data.result.message);
        }
      } catch (error: any) {
        toast.error("Tải dử liệu không thành công! vui lòng reload lại trang hoặc thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    const total = orderItems.reduce((total, item) => {
      if (item.price) {
        return item.price * (item.quantity || 1) + total;
      }
      return total;
    }, 0);
    let discount = control._defaultValues.totalDiscount || 0;
    let finalPrice = total - discount;
    if (finalPrice < 0) {
      finalPrice = 0;
    }
    return {
      total,
      discount,
      finalPrice,
    };
  }, [orderItems]);

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const res = await axiosClient.put("/order/" + id, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/orders", { state: { message: res.data.message } });
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

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Sửa Phiếp Nhập" />
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
            spacing={3}
          >
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
                defaultValue={null}
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
                    value={field.value || ""}
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
            <Grid size={12}>
              <Controller
                name="orderStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.orderStatus} required>
                    <InputLabel shrink id="demo-simple-select-label">
                      Trạng thái đơn hàng
                    </InputLabel>
                    <Select
                      {...field}
                      value={field.value || "PENDING"}
                      labelId="demo-simple-select-label"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"PENDING"}>Chờ xử lý</MenuItem>
                      <MenuItem value={"CONFIRMED"}>Đã xác nhận</MenuItem>
                      <MenuItem value={"PROCESSING"}>Đang chuẩn bị hàng</MenuItem>
                      <MenuItem value={"SHIPPING"}>Đang giao</MenuItem>
                      <MenuItem value={"DELIVERED"}>Đã Giao Hàng</MenuItem>
                      <MenuItem value={"CANCELLED"}>Đã Hủy</MenuItem>
                    </Select>
                    {errors.orderStatus && (
                      <FormHelperText>{errors.orderStatus.message}</FormHelperText>
                    )}
                  </FormControl>
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
            {control._defaultValues.voucherName != null && (
              <Grid size={12}>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: "text.primary",
                      color: "text.secondary",
                    },
                  }}
                  color="primary"
                  disabled
                  fullWidth
                  size="small"
                  label="Voucher"
                  value={control._defaultValues.voucherName}
                />
              </Grid>
            )}
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
                            {(() => {
                              const rowValues = getValues("orderItems");
                              if (rowValues && rowValues[idx]) {
                                const { quantity, price } = rowValues[idx];
                                const total = (Number(quantity) || 1) * (Number(price) || 0);
                                return (
                                  <Typography variant="body1">
                                    {total.toLocaleString("vi-VN")}đ
                                  </Typography>
                                );
                              }
                              return <Typography variant="body1">-</Typography>;
                            })()}
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
                      <TableCell colSpan={4}>
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
            <Button variant="outlined" size="large" onClick={() => navigate("/orders")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Đơn Hàng
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
