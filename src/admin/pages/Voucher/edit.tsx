import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CircularProgress from "@mui/material/CircularProgress";

import axiosClient from "~/admin/hooks/useFetch";
import { BackDropContext } from "~/admin/context/BackDrop";
import Breadcrumb from "~/admin/components/Breadcrumb";
import { Controller, useForm } from "react-hook-form";
import schema from "~/admin/schemas/voucherSchema";
import getLastError from "~/utils/onErrorValidate";

const listBreadcrumb = [
  {
    title: "Voucher",
    url: "/admin/vouchers",
  },
  {
    title: "Chỉnh Sửa Voucher",
    url: "/admin/voucher/create",
  },
];

function Edit() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setBackDrop } = useContext(BackDropContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      discountType: "AMOUNT",
    },
  });
  const watchDiscountType = watch("discountType");

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const voucher = await axiosClient.get("/voucher/" + id);
        if (voucher.data.code === 1000) {
          const data = voucher.data.result;
          reset({
            ...data,
            startDate: data?.startDate ? dayjs(data.startDate) : undefined,
            endDate: data?.endDate ? dayjs(data.endDate) : undefined,
          });
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
        name: data.name,
        code: data.code,
        status: data.status,
        discountValue: data.discountValue,
        quantity: data.quantity,
        ...(data.description && { description: data.description }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.minOrderValue && { minOrderValue: data.minOrderValue }),
        ...(data.maxDiscountValue && { maxDiscountValue: data.maxDiscountValue }),
      };

      const res = await axiosClient.put("/voucher/" + id, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/admin/vouchers", { state: { message: res.data.message } });
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
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Chỉnh Sửa Voucher" />
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
            <Grid size={4}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên voucher"
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
            <Grid size={4}>
              <Controller
                name="code"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Mã voucher"
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
            <Grid size={4}>
              <Controller
                name="quantity"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Số lượng"
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
            <Grid size={4}>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.discountType} required>
                    <InputLabel shrink id="demo-simple-select-label">
                      Đơn vị
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value={"AMOUNT"}>Cố Định</MenuItem>
                      <MenuItem value={"PERCENT"}>Phần Trăm(%)</MenuItem>
                    </Select>
                    {errors.discountType && (
                      <FormHelperText>{errors.discountType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={4}>
              <Controller
                name="discountValue"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Giá Trị"
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
            <Grid size={4}>
              <Controller
                name="maxDiscountValue"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Giảm tối đa (VND)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled={watchDiscountType === "AMOUNT"}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="minOrderValue"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Giá trị đơn hàng tối thiểu"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={4}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Ngày Bắt Đầu"
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
            <Grid size={4}>
              <Controller
                name="endDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Ngày kết thúc"
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
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Mô tả"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
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

          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}
          >
            <Button variant="outlined" size="large" onClick={() => navigate("/admin/vouchers")}>
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Voucher
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
