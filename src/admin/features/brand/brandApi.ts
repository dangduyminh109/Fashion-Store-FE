import createApiThunk from "../../../utils/createApiThunk";

export const fetchBrand = createApiThunk({ prefix: "brand/fetchBrand" });
export const updateStatus = createApiThunk({ prefix: "brand/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "brand/deleteOrRestore" });
