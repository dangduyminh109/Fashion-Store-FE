import * as yup from "yup";

const schema = yup.object({
  updates: yup.array().of(
    yup.object({
      id: yup.number().required("Thiếu ID"),
      name: yup.string().nullable().optional(),
      permissionIds: yup.array(yup.number()).required("Danh sách quyền không được để trống"),
    })
  ),
});

export default schema;
