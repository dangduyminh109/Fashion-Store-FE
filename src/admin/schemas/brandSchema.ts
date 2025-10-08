import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên thương hiệu không được để trống!"),
  status: yup.boolean().default(true),
  image: yup.mixed<File>().nullable().optional(),
});

export default schema;
