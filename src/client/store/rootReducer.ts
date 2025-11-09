import { combineReducers } from "redux";
import navbarReducer from "~/client/features/sidebar/sildebarSlice";
import productReducer from "~/client/features/product/productSlice";
import categoryReducer from "~/client/features/brand/brandSlice";
import postReducer from "~/client/features/post/postSlice";
export const rootReducer = combineReducers({
  navbar: navbarReducer,
  product: productReducer,
  category: categoryReducer,
  post: postReducer,
});
