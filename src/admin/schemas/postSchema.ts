import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required("Tên bài đăng không được để trống!"),
  status: yup.boolean().default(true),
  topicId: yup.number().nullable().optional(),
  image: yup.mixed<File>().nullable().optional(),
  imgPreviews: yup.array(yup.string()).optional(),
  imageDelete: yup.boolean().default(false),
});
export default schema;
