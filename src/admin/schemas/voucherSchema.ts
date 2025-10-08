import type { Dayjs } from "dayjs";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên voucher không được để trống!"),
  description: yup.string().nullable().optional(),
  code: yup.string().required("Mã voucher không được để trống!"),
  status: yup.boolean().default(true),
  startDate: yup.mixed<Dayjs>().nullable().optional(),
  endDate: yup.mixed<Dayjs>().nullable().optional(),
  discountType: yup.string().default("TEXT").required("Loại voucher không được để trống!"),
  quantity: yup
    .number()
    .typeError("Số lượng phải là số!")
    .min(0, "Số lượng không được âm!")
    .required("Vui lòng nhập số lượng!"),
  discountValue: yup
    .number()
    .nullable()
    .typeError("Giá trị giảm phải là số")
    .min(0, "Giá trị giảm không được âm")
    .required("Vui lòng nhập số tiền giảm")
    .when("discountType", {
      is: "PERCENT",
      then: (schema) =>
        schema
          .min(1, "Giá trị phần trăm phải ≥ 1")
          .max(100, "Giá trị phần trăm không được > 100")
          .required("Vui lòng nhập phần trăm giảm"),
    }),
  maxDiscountValue: yup
    .number()
    .typeError("Giá trị giảm tối đa phải là số")
    .min(0, "Giá trị giảm tối đa không được âm")
    .nullable()
    .optional(),
  minOrderValue: yup
    .number()
    .typeError("Giá trị đơn hàng tối thiểu phải là số")
    .min(0, "Giá trị đơn hàng tối thiểu không được âm")
    .nullable()
    .optional(),
});

export default schema;
