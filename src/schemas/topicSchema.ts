import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên chủ đề không được để trống!"),
  status: yup.boolean().default(true),
});

export default schema;
