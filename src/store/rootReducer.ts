import { combineReducers } from "@reduxjs/toolkit";

import productReducer from "~/features/product/productSlice";

export const rootReducer = combineReducers({
  product: productReducer,
});
