import createApiThunk from "../../../utils/createApiThunk";

export const fetchSupplier = createApiThunk({ prefix: "supplier/fetchSupplier" });
export const updateStatus = createApiThunk({ prefix: "supplier/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "supplier/deleteOrRestore" });
