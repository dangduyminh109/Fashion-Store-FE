import createApiThunk from "../../utils/createApiThunk";

export const fetchRole = createApiThunk({ prefix: "role/fetchRole" });
export const updateStatus = createApiThunk({ prefix: "role/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "role/deleteOrRestore" });
