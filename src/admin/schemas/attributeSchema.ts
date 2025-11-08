import * as yup from "yup";

const createSchema = yup.object({
  name: yup.string().required("Tên thuộc tính không được để trống!"),
  displayType: yup.string().default("TEXT").required("Loại hiển thị không được để trống!"),
  status: yup.boolean().default(true),
  listAttributeValue: yup
    .array()
    .of(
      yup.object({
        value: yup.string().when("$$parent.displayType", {
          is: (val: string) => val === "TEXT" || val === "SELECT",
          then: (schema) => schema.required("Giá trị là bắt buộc khi kiểu hiển thị TEXT"),
          otherwise: (schema) => schema.optional(),
        }),
        color: yup.string().when("$$parent.displayType", {
          is: "COLOR",
          then: (schema) => schema.required("Color là bắt buộc khi kiểu hiển thị COLOR"),
          otherwise: (schema) => schema.optional(),
        }),
        image: yup.mixed<File>().when("$$parent.displayType", {
          is: "IMAGE",
          then: (schema) => schema.required("Bắt buộc tải lên ảnh khi kiểu hiển thị IMAGE"),
          otherwise: (schema) => schema.optional(),
        }),
      })
    )
    .min(1, "Cần có ít nhất một giá trị cho thuộc tính"),
});

const editSchema = yup.object({
  name: yup.string().required("Tên thuộc tính không được để trống!"),
  displayType: yup.string().default("TEXT").required("Loại hiển thị không được để trống!"),
  status: yup.boolean().default(true),
  listAttributeValue: yup
    .array()
    .of(
      yup.object({
        id: yup.string().optional(),
        imgPreview: yup.string().optional(),
        value: yup.string().required("Tên giá trị không được để trống"),
        color: yup.string().when("$$parent.displayType", {
          is: "COLOR",
          then: (schema) => schema.required("Color là bắt buộc khi kiểu hiển thị COLOR"),
          otherwise: (schema) => schema.optional(),
        }),
        image: yup.mixed<File>().when("$$parent.displayType", {
          is: "IMAGE",
          then: (schema) => schema.required("Bắt buộc tải lên ảnh khi kiểu hiển thị IMAGE"),
          otherwise: (schema) => schema.optional(),
        }),
        imageDelete: yup.boolean().default(false).optional(),
      })
    )
    .min(1, "Cần có ít nhất một giá trị cho thuộc tính"),
});

export { createSchema, editSchema };
