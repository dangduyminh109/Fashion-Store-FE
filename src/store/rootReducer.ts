import { combineReducers } from "@reduxjs/toolkit";

import productReducer from "~/features/product/productSlice";
import categoryReducer from "~/features/category/categorySlice";
import brandReducer from "~/features/brand/brandSlice";
import attributeReducer from "~/features/attribute/attributeSlice";
import importReceiptReducer from "~/features/importReceipt/importReceiptSlice";
import supplierReducer from "~/features/supplier/supplierSlice";
import roleReducer from "~/features/role/roleSlice";
import userReducer from "~/features/user/userSlice";
import voucherReducer from "~/features/voucher/voucherSlice";
import customerReducer from "~/features/customer/customerSlice";
import topicReducer from "~/features/topic/topicSlice";
import postReducer from "~/features/post/postSlice";

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
});
