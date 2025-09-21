import * as yup from "yup";
const createSchema = yup.object({
  customerName: yup.string().required("Tên Khách hàng không được để trống"),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(0[1-9][0-9]{8})$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Địa chỉ không được để trống"),
  district: yup.number().required("Địa chỉ không được để trống"),
  city: yup.number().required("Địa chỉ không được để trống"),
  ward: yup.number().nullable().optional(),
  note: yup.string().nullable().optional(),
  paymentMethod: yup.string().required("Phương thức thanh toán không hợp lệ!"),
  voucherId: yup.number().nullable().optional(),
  isPaid: yup.boolean().required(),
  customerId: yup.string().nullable().optional(),
  orderItems: yup
    .array()
    .of(
      yup.object({
        name: yup.mixed().notRequired(),
        value: yup.mixed().notRequired(),
        price: yup.number().notRequired(),
        sku: yup.string().required("Lỗi: Sku của sản phẩm không hợp lệ!"),
        quantity: yup.number().required("Số Lượng không để trống!").min(1, "Số lượng phải >= 0!"),
      })
    )
    .min(1, "Cần có ít nhất sản phẩm cho đơn hàng1"),
});

const editSchema = yup.object({
  customerName: yup.string().required("Tên Khách hàng không được để trống"),
  voucherName: yup.string().notRequired(),
  totalDiscount: yup.number().notRequired(),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^(0[1-9][0-9]{8})$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Địa chỉ không được để trống"),
  district: yup.number().required("Địa chỉ không được để trống"),
  city: yup.number().required("Địa chỉ không được để trống"),
  ward: yup.number().nullable().optional(),
  note: yup.string().nullable().optional(),
  paymentMethod: yup.string().required("Phương thức thanh toán không hợp lệ!"),
  orderStatus: yup.string().required("Trạng thái đơn hàng không hợp lệ!"),
  isPaid: yup.boolean().required(),
  orderItems: yup
    .array()
    .of(
      yup.object({
        name: yup.mixed().notRequired(),
        value: yup.mixed().notRequired(),
        price: yup.number().notRequired(),
        sku: yup.string().notRequired(),
        quantity: yup.number().notRequired(),
      })
    )
    .notRequired(),
});

export { createSchema, editSchema };
