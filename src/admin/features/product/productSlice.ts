import { createSlice } from "@reduxjs/toolkit";
import { STATUS, type StatusType } from "~/admin/constants/status";
import type Product from "~/admin/types/product";
import type Variant from "~/admin/types/variant";
import { fetchProduct, deleteOrRestore, updateStatus } from "./productApi";

interface initialStateType {
  status: StatusType;
  data: any;
  message?: string;
  code?: number | null;
}

const initialState: initialStateType = {
  status: STATUS.IDLE,
  data: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get product
      .addCase(fetchProduct.pending, (state) => {
        state.status = STATUS.LOADING;
        state.data = [];
        state.message = "";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload.result || [];
        state.message = action.payload.message || "";
        state.code = action.payload.code || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.data = action.payload?.result;
        state.code = action.payload?.code ?? null;
        state.message = action.payload?.message || "Không thể tải dữ liệu. Có lỗi xảy ra!!!";
      })

      // status
      .addCase(updateStatus.fulfilled, (state, action) => {
        if (state.code === 1000 && action.meta.arg) {
          const arg = action.meta.arg.url.split("/");
          if (!arg.includes("variant")) {
            const updatedId = arg[2];
            let field = arg[3];
            const item = state.data.find((x: Product) => x.id.toString() === updatedId);
            if (field == "featured") field = "isFeatured";
            if (item && field) {
              item[field] = !item[field];
            }
          } else {
            const updatedId = arg[3];
            const field = arg[4];
            state.data.forEach((p: Product) => {
              const item = p.variants.find((v: Variant) => v.id.toString() === updatedId);
              if (item && field === "status") {
                item.status = !item.status;
              }
            });
          }
        }
      })
      // delete or restore
      .addCase(deleteOrRestore.fulfilled, (state, action) => {
        if (state.code === 1000 && action.meta.arg) {
          const arg = action.meta.arg.url.split("/");
          const updatedId = arg[2];
          state.data = state.data.filter((x: Product) => x.id.toString() != updatedId);
        }
      });
  },
});

export default productSlice.reducer;
