import { combineReducers } from "@reduxjs/toolkit";

import productReducer from "~/features/product/productSlice";
import categoryReducer from "~/features/category/categorySlice";
import brandReducer from "~/features/brand/brandSlice";
import attributeReducer from "~/features/attribute/attributeSlice";

export const rootReducer = combineReducers({
  product: productReducer,
  category: categoryReducer,
  brand: brandReducer,
  attribute: attributeReducer,
});
