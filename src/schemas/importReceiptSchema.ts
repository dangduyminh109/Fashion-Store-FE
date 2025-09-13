import type { Dayjs } from "dayjs";
import * as yup from "yup";

const createSchema = yup.object({
  supplierId: yup.number().nullable().optional(),
  importDate: yup.mixed<Dayjs>().optional(),
  note: yup.string().nullable().optional(),
  importItemList: yup
    .array()
    .of(
      yup.object({
        sku: yup.string().required("Mã sản phẩm không được để trống!"),
        quantity: yup
          .number()
          .typeError("Số lượng phải là số!")
          .min(0, "Số lượng không được âm!")
          .required("Vui lòng nhập số lượng!"),
        importPrice: yup
          .number()
          .typeError("Giá nhập phải là số!")
          .min(0, "Giá nhập không được âm!")
          .required("Vui lòng thêm giá nhập!"),
        discountAmount: yup
          .number()
          .nullable()
          .typeError("Số tiền giảm giá phải là số!")
          .min(0, "Số tiền giảm giá không được âm!")
          .test(
            "max-discount",
            "Số tiền giảm giá không được lớn hơn thành tiền!",
            function (value) {
              const { importPrice, quantity } = this.parent;
              if (value == null) return true;
              return value <= importPrice * quantity;
            }
          )
          .optional(),
      })
    )
    .min(1, "Phiếu nhập phải có ít nhất 1 sản phẩm!"),
});

const editSchema = yup.object({
  supplierId: yup.number().nullable().optional(),
  importDate: yup.mixed<Dayjs>().optional(),
  note: yup.string().nullable().optional(),
});

export { createSchema, editSchema };
