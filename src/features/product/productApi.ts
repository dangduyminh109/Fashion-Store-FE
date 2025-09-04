import createApiThunk from "../../utils/createApiThunk";

export const fetchProduct = createApiThunk({ prefix: "product/fetchProduct" });
export const updateStatus = createApiThunk({ prefix: "product/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "product/deleteOrRestore" });
