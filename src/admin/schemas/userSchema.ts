import * as yup from "yup";

const createSchema = yup.object({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  status: yup.boolean().default(true),
  email: yup.string().nullable().optional(),
  firstName: yup.string().nullable().optional(),
  lastName: yup.string().nullable().optional(),
  phone: yup.string().nullable().optional(),
  roleId: yup.string().nullable().optional(),
  avatar: yup.mixed<File>().nullable().optional(),
});

const editSchema = yup.object({
  username: yup.string().required("Tên đăng nhập không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  status: yup.boolean().default(true),
  email: yup.string().nullable().optional(),
  firstName: yup.string().nullable().optional(),
  lastName: yup.string().nullable().optional(),
  phone: yup.string().nullable().optional(),
  roleId: yup.string().nullable().optional(),
  avatar: yup.mixed<File>().nullable().optional(),
  avatarPreview: yup.string().nullable().optional(),
  avatarDelete: yup.boolean().default(false),
});

export { createSchema, editSchema };
