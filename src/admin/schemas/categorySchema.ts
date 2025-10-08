import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên chủ đề không được để trống!"),
  parentId: yup.number().nullable().optional(),
  status: yup.boolean().default(true),
  image: yup.mixed<File>().nullable().optional(),
  imgPreview: yup.string().optional(),
  imageDelete: yup.boolean().default(false),
});

export default schema;
