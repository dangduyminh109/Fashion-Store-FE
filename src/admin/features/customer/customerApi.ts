import createApiThunk from "../../../utils/createApiThunk";

export const fetchCustomer = createApiThunk({ prefix: "customer/fetchCustomer" });
export const updateStatus = createApiThunk({ prefix: "customer/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "customer/deleteOrRestore" });
