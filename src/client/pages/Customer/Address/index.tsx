import { Button } from "@mui/material";
import { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";

import { BackDropContext } from "~/client/context/BackDrop";
import PrimaryButton from "~/client/components/PrimaryButton";
import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import type Address from "~/client/types/address";
import ConfirmModel from "~/client/components/ConfirmModel";
import { FormAddress } from "./components/FormAddress";
import { AuthContext } from "~/client/context/AuthContext";

export const AddressPage = () => {
  const [loading] = useState(false);
  const { setBackDrop } = useContext(BackDropContext);
  const [addressData, setAddressData] = useState<Address | null>(null);

  const { customer, setCustomer } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [open, setOpen] = useState<boolean>(false);

  async function handleDelete() {
    setOpen(false);
    try {
      const result = await axiosClient.delete("/address/" + addressData?.id + "/destroy");
      if (result.data.code === 1000) {
        if (customer) {
          const newAddress = customer.addresses.filter((item) => item.id !== addressData?.id);
          const updatedCustomer = { ...customer, addresses: newAddress };
          setCustomer(updatedCustomer);
          localStorage.setItem("customer", JSON.stringify(updatedCustomer));
        }
        toast.success(result.data.message);
      } else {
        toast.success("Xóa không thành công! có lỗi xãy ra!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Có lỗi xảy ra!");
    }
  }

  const setDefault = async (data: Address) => {
    setBackDrop(true);
    if (!customer) {
      toast.error("Có lỗi xãy ra!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append(`name`, data.name);
      formData.append(`customerId`, customer.id);
      formData.append(`address`, data.address);
      formData.append(`phone`, data.phone);
      formData.append(`cityId`, String(data.cityId));
      formData.append(`districtId`, String(data.districtId));
      formData.append(`wardId`, String(data.wardId));
      formData.append(`city`, data.city);
      formData.append(`district`, data.district);
      formData.append(`ward`, data.ward);
      formData.append(`isDefault`, String(!data.isDefault));
      const res = await axiosClient.put("/address/" + data.id, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.code == 1000) {
        customer.addresses = customer.addresses.map((c) => {
          return {
            ...c,
            isDefault: false,
          };
        });
        let newAddress = customer.addresses.filter((item) => item.id != data.id);
        customer.addresses = newAddress;
        customer.addresses.push(res.data.result);
        localStorage.setItem("customer", JSON.stringify(customer));
        setShowForm(false);
        return;
      }
      toast.error(res.data.message);
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

  return (
    <Box
      sx={{
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        width: "99%",
        height: "100%",
        p: 2,
      }}
    >
      <FormAddress
        showForm={showForm}
        setShowForm={setShowForm}
        addressData={addressData}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <ConfirmModel
        title={"Xóa Địa Chỉ"}
        content={"Bạn Có Chắc Muốn xóa địa chỉ này không!!!"}
        open={open}
        setOpen={setOpen}
        handleSubmit={() => handleDelete()}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
        <Typography variant="h3" my={1}>
          Quản Lý Địa Chỉ
        </Typography>
        <PrimaryButton disabled={loading} onClick={() => setShowForm(true)}>
          Thêm Địa Chỉ Mới
        </PrimaryButton>
      </Box>
      <hr />
      {!customer || customer?.addresses?.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", my: 2 }}>
          Chưa có địa chỉ nào!
        </Typography>
      ) : (
        <Box sx={{ height: "100%", overflow: "hidden" }}>
          {[...customer?.addresses]
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((item) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {item.name} | {item.phone}
                    </Typography>
                    <Typography variant="body1">{item.address}</Typography>
                    <Typography variant="body1">
                      {item.city},{item.district},{item.ward}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "end",
                      gap: 1,
                      flexDirection: "column",
                    }}
                  >
                    <Box>
                      <Button
                        variant="contained"
                        endIcon={<EditIcon />}
                        onClick={() => {
                          setAddressData(item);
                          setShowForm(true);
                          setIsUpdate(true);
                        }}
                      >
                        Cập nhật
                      </Button>
                      {!item.isDefault && (
                        <IconButton
                          aria-label="delete"
                          sx={{
                            ml: 1,
                            borderRadius: "5px",
                            bgcolor: "error.main",
                            "&:hover": {
                              bgcolor: "error.main",
                            },
                          }}
                          onClick={() => {
                            setOpen(true);
                            setAddressData(item);
                          }}
                        >
                          <DeleteIcon sx={{ color: "#fff" }} />
                        </IconButton>
                      )}
                    </Box>
                    <PrimaryButton disabled={item.isDefault} onClick={() => setDefault(item)}>
                      Đặc làm mặc định
                    </PrimaryButton>
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
};
