import { combineReducers } from "@reduxjs/toolkit";

import productReducer from "~/features/product/productSlice";
import categoryReducer from "~/features/category/categorySlice";
import brandReducer from "~/features/brand/brandSlice";

export const rootReducer = combineReducers({
  product: productReducer,
  category: categoryReducer,
  brand: brandReducer,
});
