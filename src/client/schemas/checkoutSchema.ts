import * as yup from "yup";

const createSchema = yup.object({
  customerName: yup.string().required("Tên không được để trống!"),
  email: yup.string().required("Email không được để trống!"),
  address: yup.string().required("Vui lòng nhập địa chỉ cụ thể!"),
  phone: yup.string().required("Vui lòng nhập số điện thoại!"),
  cityId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  districtId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  wardId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  note: yup.string().optional().nullable(),
  voucherId: yup.string().optional().nullable(),
  paymentMethod: yup.string().required("Vui lòng chọn phương thức thanh toán!"),
});

export { createSchema };
