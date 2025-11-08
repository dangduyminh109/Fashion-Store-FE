import { createSlice } from "@reduxjs/toolkit";
import { fetchBrand } from "./brandApi";
import type Brand from "~/client/types/brand";
interface initialStateType {
  loading: "idle" | "pending" | "succeeded" | "failed";
  listBrand: Brand[];
  error: any;
}

const initialState: initialStateType = {
  listBrand: [],
  loading: "idle",
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrand.pending, (state, _) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.listBrand = [...state.listBrand, ...action.payload.result];
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error;
      });
  },
});

export default brandSlice.reducer;
