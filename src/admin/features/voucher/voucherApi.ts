import createApiThunk from "../../../utils/createApiThunk";

export const fetchVoucher = createApiThunk({ prefix: "voucher/fetchVoucher" });
export const updateStatus = createApiThunk({ prefix: "voucher/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "voucher/deleteOrRestore" });
