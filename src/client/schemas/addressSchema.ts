import * as yup from "yup";

const createSchema = yup.object({
  id: yup.number().optional().nullable(),
  name: yup.string().required("Tên không được để trống!"),
  address: yup.string().required("Vui lòng nhập địa chỉ cụ thể!"),
  phone: yup.string().required("Vui lòng nhập địa số điện thoại!"),
  cityId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  districtId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  wardId: yup.number().required("Vui lòng nhập đầy đủ thông tin địa chỉ!"),
  isDefault: yup.boolean().default(false),
});

export { createSchema };
