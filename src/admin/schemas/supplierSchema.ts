import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên nhà cùng cấp không được để trống!"),
  email: yup.string().nullable().email("Email không hợp lệ").optional(),
  phone: yup
    .string()
    .nullable()
    .optional()
    .matches(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số"),
  address: yup.string().nullable().optional(),
  status: yup.boolean().default(false).required("Tên nhà cùng cấp không được để trống!"),
});

export default schema;
