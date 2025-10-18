import { combineReducers } from "redux";
import navbarReducer from "~/client/features/sidebar/sildebarSlice";

export const rootReducer = combineReducers({
  navbar: navbarReducer,
});
