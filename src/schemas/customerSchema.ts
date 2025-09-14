import * as yup from "yup";

const createSchema = yup.object({
  fullName: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  status: yup.boolean().default(true),
  providerId: yup.string().nullable().optional(),
  email: yup.string().nullable().optional(),
  phone: yup.string().nullable().optional(),
  authProvider: yup.string().required("Phương thức đăng kí không được để trống!"),
  avatar: yup.mixed<File>().nullable().optional(),
});

const editSchema = yup.object({
  fullName: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    ),
  status: yup.boolean().default(true),
  providerId: yup.string().nullable().optional(),
  email: yup.string().nullable().optional(),
  phone: yup.string().nullable().optional(),
  avatar: yup.mixed<File>().nullable().optional(),
  authProvider: yup.string().required("Phương thức đăng kí không được để trống!"),
  avatarPreview: yup.string().nullable().optional(),
});

export { createSchema, editSchema };
