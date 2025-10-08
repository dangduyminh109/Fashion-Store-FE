import createApiThunk from "../../../utils/createApiThunk";

export const fetchUser = createApiThunk({ prefix: "user/fetchUser" });
export const updateStatus = createApiThunk({ prefix: "user/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "user/deleteOrRestore" });
