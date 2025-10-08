import { combineReducers } from "@reduxjs/toolkit";

import productReducer from "~/admin/features/product/productSlice";
import categoryReducer from "~/admin/features/category/categorySlice";
import brandReducer from "~/admin/features/brand/brandSlice";
import attributeReducer from "~/admin/features/attribute/attributeSlice";
import importReceiptReducer from "~/admin/features/importReceipt/importReceiptSlice";
import supplierReducer from "~/admin/features/supplier/supplierSlice";
import roleReducer from "~/admin/features/role/roleSlice";
import userReducer from "~/admin/features/user/userSlice";
import voucherReducer from "~/admin/features/voucher/voucherSlice";
import customerReducer from "~/admin/features/customer/customerSlice";
import topicReducer from "~/admin/features/topic/topicSlice";
import postReducer from "~/admin/features/post/postSlice";
import orderReducer from "~/admin/features/order/orderSlice";

export const rootReducer = combineReducers({
  product: productReducer,
  category: categoryReducer,
  brand: brandReducer,
  attribute: attributeReducer,
  importReceipt: importReceiptReducer,
  supplier: supplierReducer,
  role: roleReducer,
  user: userReducer,
  voucher: voucherReducer,
  customer: customerReducer,
  topic: topicReducer,
  post: postReducer,
  order: orderReducer,
});
