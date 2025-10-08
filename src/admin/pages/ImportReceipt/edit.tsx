import { useContext, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TableContainer } from "@mui/material";
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
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";

import { editSchema as schema } from "~/admin/schemas/importReceiptSchema";
import { BackDropContext } from "~/admin/context/BackDrop";
import type Supplier from "~/admin/types/supplier";
import Breadcrumb from "~/admin/components/Breadcrumb";
import getLastError from "~/utils/onErrorValidate";
import axiosClient from "~/admin/hooks/useFetch";
import formatToLocalDateTime from "~/utils/formatToLocalDateTime";

const listBreadcrumb = [
  {
    title: "Phiếu nhập",
    url: "/admin/product/import-receipts",
  },
  {
    title: "Sửa Phiếu nhập",
    url: "/admin/import-receipt/edit",
  },
];

function Edit() {
  const { setBackDrop } = useContext(BackDropContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [importItemList, setImportItemList] = useState([]);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { id } = useParams();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [supplier, importReceipt] = await Promise.all([
          axiosClient.get("/supplier"),
          axiosClient.get("/import-receipt/" + id),
        ]);
        if (supplier.data.code == 1000) {
          setSupplierList(supplier.data.result);
        } else if (supplier.data.code != 9401 || supplier.data.code != 9400) {
          toast(supplier.data.result.message);
        }

        if (importReceipt.data.code == 1000) {
          const data = importReceipt.data.result;
          setValue("supplierId", data.supplierId);
          setValue("note", data.note);
          setValue("importDate", dayjs(data.importDate) || undefined);
          const importItemList = data.importItemList?.map((item: any) => {
            return {
              sku: item.sku,
              displayName: item.displayName,
              productName: item.productName,
              quantity: item.quantity,
              importPrice: item.importPrice,
              discountAmount: item.discountAmount,
            };
          });
          setImportItemList(importItemList);
        } else if (importReceipt.data.code != 9401 || importReceipt.data.code != 9400) {
          toast(importReceipt.data.result.message);
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

      const res = await axiosClient.put("/import-receipt/" + id, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        navigate("/admin/product/import-receipts", { state: { message: res.data.message } });
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
                        <MenuItem value={String(item.id)} key={item.id}>
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
          <Box sx={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: "10px" }}>
            {importItemList && importItemList.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Mã Sản phẩm</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Tên Sản phẩm</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Số lượng</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giá nhập</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Giảm giá</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importItemList.map((item: any, idx) => {
                      return (
                        <TableRow
                          key={idx}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "& .MuiFormControl-root": {
                              margin: " 10px !important",
                            },
                          }}
                        >
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {item.sku}
                            {item.displayName && ` (${item.displayName})`}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <Typography
                              variant="body1"
                              sx={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.productName}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{item.quantity}</TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{item.importPrice}</TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{item.discountAmount}</TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {item.quantity * item.importPrice - item.discountAmount}
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
              onClick={() => navigate("/admin/product/import-receipts")}
            >
              Quay Lại
            </Button>
            <Button variant="outlined" size="large" type="submit">
              Sửa Phiếu Nhập
            </Button>
          </Box>
        </form>
      )}
    </Fragment>
  );
}

export default Edit;
