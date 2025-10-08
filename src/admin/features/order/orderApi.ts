import createApiThunk from "../../../utils/createApiThunk";

export const fetchOrder = createApiThunk({ prefix: "order/fetchOrder" });
export const updateStatus = createApiThunk({ prefix: "order/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "order/deleteOrRestore" });
