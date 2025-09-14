import { createSlice } from "@reduxjs/toolkit";
import { STATUS, type StatusType } from "~/constants/status";
import { fetchVoucher, deleteOrRestore, updateStatus } from "./voucherApi";
import type Voucher from "~/types/voucher";

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

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get voucher
      .addCase(fetchVoucher.pending, (state) => {
        state.status = STATUS.LOADING;
        state.data = [];
        state.message = "";
      })
      .addCase(fetchVoucher.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.data = action.payload.result || [];
        state.message = action.payload.message || "";
        state.code = action.payload.code || null;
      })
      .addCase(fetchVoucher.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.data = action.payload?.result;
        state.code = action.payload?.code ?? null;
        state.message = action.payload?.message || "Không thể tải dữ liệu. Có lỗi xảy ra!!!";
      })

      // status
      .addCase(updateStatus.fulfilled, (state, action) => {
        if (state.code === 1000 && action.meta.arg) {
          const arg = action.meta.arg.url.split("/");
          const updatedId = arg[2];
          const item = state.data.find((c: Voucher) => c.id.toString() === updatedId);
          if (item) {
            item.status = !item.status;
          }
        }
      })
      // delete or restore
      .addCase(deleteOrRestore.fulfilled, (state, action) => {
        if (state.code === 1000 && action.meta.arg) {
          const arg = action.meta.arg.url.split("/");
          const updatedId = arg[2];
          state.data = state.data.filter((x: Voucher) => x.id.toString() != updatedId);
        }
      });
  },
});

export default voucherSlice.reducer;
