import { forwardRef, useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import logo from "~/assets/images/Logo/logo-black.png";
import { createSchema } from "~/client/schemas/addressSchema";
import PrimaryButton from "~/client/components/PrimaryButton";
import { BackDropContext } from "~/client/context/BackDrop";
import axiosClient from "~/client/hooks/useFetch";
import getLastError from "~/utils/onErrorValidate";
import { AuthContext } from "~/client/context/AuthContext";
import type Address from "~/client/types/address";
import type addressResponse from "~/client/types/addressResponse";
import { handleSelectProvince, handleSelectDistrict } from "~/utils/fetchAddress";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

type Props = {
  showForm: boolean;
  isUpdate: boolean;
  addressData: Address | null;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormAddress = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const [provinces, setProvinces] = useState<addressResponse[]>([]);
  const [districts, setDistricts] = useState<addressResponse[]>([]);
  const [wards, setWards] = useState<addressResponse[]>([]);
  const { showForm, setShowForm, setIsUpdate, isUpdate, addressData } = props;

  const { customer } = useContext(AuthContext);
  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      id: isUpdate && addressData ? addressData.id : null,
      name: isUpdate && addressData ? addressData.name : "",
      address: isUpdate && addressData ? addressData.address : "",
      phone: isUpdate && addressData ? addressData.phone : "",
      cityId: isUpdate && addressData ? addressData.cityId : 1,
      districtId: isUpdate && addressData ? addressData.districtId : 1,
      wardId: isUpdate && addressData ? addressData.wardId : 1,
      isDefault: isUpdate && addressData ? addressData.isDefault : false,
    },
  });

  useEffect(() => {
    if (isUpdate && addressData) {
      setValue("id", addressData.id);
      setValue("name", addressData.name);
      setValue("address", addressData.address);
      setValue("phone", addressData.phone);
      setValue("cityId", addressData.cityId);
      setValue("districtId", addressData.districtId);
      setValue("wardId", addressData.wardId);
      setValue("isDefault", addressData.isDefault);
      handleSelectProvince(addressData.cityId, setLoading, setDistricts);
      handleSelectDistrict(addressData.districtId, setLoading, setWards);
    } else {
      handleSelectProvince(1, setLoading, setDistricts);
      reset();
    }
  }, [isUpdate, addressData]);

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

  const onSubmit = async (data: any) => {
    let city = provinces.find((item) => item.code == data.cityId);
    let district = districts.find((item) => item.code == data.districtId);
    let ward = wards.find((item) => item.code == data.wardId);
    if (!customer || !city || !district || !ward) {
      toast.error("Có lỗi xãy ra!");
      return;
    }
    setBackDrop(true);
    try {
      const formData = new FormData();
      formData.append(`name`, data.name);
      formData.append(`customerId`, customer.id);
      formData.append(`address`, data.address);
      formData.append(`phone`, data.phone);
      formData.append(`cityId`, data.cityId);
      formData.append(`districtId`, data.districtId);
      formData.append(`wardId`, data.wardId);
      formData.append(`city`, city.name);
      formData.append(`district`, district.name);
      formData.append(`ward`, ward.name);
      formData.append(`isDefault`, data.isDefault);
      if (isUpdate && addressData) {
        const res = await axiosClient.put("/address/" + addressData.id, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.code == 1000) {
          if (data.isDefault) {
            customer.addresses = customer.addresses.map((c) => {
              return {
                ...c,
                isDefault: false,
              };
            });
          }
          reset();
          let newAddress = customer.addresses.filter((item) => item.id != data.id);
          customer.addresses = newAddress;
          customer.addresses.push(res.data.result);
          localStorage.setItem("customer", JSON.stringify(customer));
          setShowForm(false);
          return;
        }
        toast.error(res.data.message);
      } else {
        const res = await axiosClient.post("/address", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.code == 1000) {
          if (data.isDefault) {
            customer.addresses = customer.addresses.map((c) => {
              return {
                ...c,
                isDefault: false,
              };
            });
          }
          reset();
          customer.addresses.push(res.data.result);
          localStorage.setItem("customer", JSON.stringify(customer));
          setShowForm(false);
          return;
        }
        toast.error(res.data.message);
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
    <Dialog
      open={showForm}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={() => {
        setShowForm(false);
        setIsUpdate(false);
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle sx={{ backgroundColor: "background.default" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            p: 1,
            maxWidth: "500px",
          }}
        >
          <Box sx={{ height: "30px" }}>
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ height: "100%", objectFit: "cover" }}
            />
          </Box>
          <IconButton
            aria-label="Close"
            onClick={() => {
              setShowForm(false);
              setIsUpdate(false);
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "background.default",
          maxWidth: "500px",
          overflow: "hidden",
          p: 2,
          "& .MuiFormLabel-root": {
            color: "text.primary",
          },
          "& *": {
            color: "text.primary",
          },
          "& .MuiPaper-root": {
            bgcolor: "Background.default",
          },
        }}
      >
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Nhập Thông Tin Địa Chỉ
        </Typography>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Controller
                name="name"
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
                    label="Số Điện Thoại"
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
                name="cityId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
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
                  <FormControl fullWidth>
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
                  <FormControl fullWidth>
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
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={<Checkbox />}
                    label="Đặt làm mặc định"
                    color="secondary"
                  />
                )}
              />
            </Grid>
          </Grid>
          <PrimaryButton
            sx={{ display: "block", mt: 1, ml: "auto" }}
            type="submit"
            disabled={loading}
          >
            Hoàn Thành
          </PrimaryButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};
