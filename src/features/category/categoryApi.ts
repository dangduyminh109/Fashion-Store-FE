import createApiThunk from "../../utils/createApiThunk";

export const fetchCategory = createApiThunk({ prefix: "category/fetchCategory" });
export const updateStatus = createApiThunk({ prefix: "category/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "category/deleteOrRestore" });
