import createApiThunk from "../../../utils/createApiThunk";

export const fetchPost = createApiThunk({ prefix: "post/fetchPost" });
export const updateStatus = createApiThunk({ prefix: "post/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "post/deleteOrRestore" });
