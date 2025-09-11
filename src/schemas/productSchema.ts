import * as yup from "yup";
import { Dayjs } from "dayjs";

const schema = yup.object({
  name: yup.string().required("Tên sản phẩm không được để trống"),
  status: yup.boolean().default(true),
  categoryId: yup.string().optional(),
  brandId: yup.string().optional(),
  images: yup.array().of(yup.mixed<File>()).max(12, "Chỉ được upload tối đa 12 ảnh"),
  isFeatured: yup.boolean().default(false).optional(),
  imgPreviews: yup.array(yup.string()).optional(),
  variantList: yup
    .array()
    .of(
      yup.object({
        id: yup.number().nullable().optional(),
        value: yup.string().nullable().optional(),
        sku: yup.string().required("SKU không được để trống"),
        originalPrice: yup
          .number()
          .nullable()
          .typeError("Giá gốc phải là số")
          .min(0, "Giá gốc không được âm")
          .optional(),
        salePrice: yup
          .number()
          .typeError("Giá bán phải là số")
          .min(0, "Giá bán không được âm")
          .required("Vui lòng nhập giá bán"),
        promotionalPrice: yup
          .number()
          .nullable()
          .typeError("Giá khuyến mãi phải là số")
          .min(0, "Giá khuyến mãi không được âm")
          .max(yup.ref("salePrice"), "Giá khuyến mãi không được lớn hơn giá bán")
          .optional(),
        promotionStartTime: yup.mixed<Dayjs>().nullable().optional(),
        promotionEndTime: yup.mixed<Dayjs>().nullable().optional(),
        inventory: yup
          .number()
          .typeError("Tồn kho phải là số")
          .min(0, "Tồn kho không được âm")
          .required("Vui lòng nhập số lượng tồn"),
        attributeValue: yup.array(yup.number()).optional(),
      })
    )
    .min(1, "Cần có ít nhất một biến thể sản phẩm"),
});
export default schema;
