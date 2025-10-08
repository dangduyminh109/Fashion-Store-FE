import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên vai trò không được để trống!"),
  status: yup.boolean().default(true),
  description: yup.string().nullable().optional(),
});

export default schema;
