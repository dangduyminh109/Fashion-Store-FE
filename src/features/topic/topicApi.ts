import createApiThunk from "../../utils/createApiThunk";

export const fetchTopic = createApiThunk({ prefix: "topic/fetchTopic" });
export const updateStatus = createApiThunk({ prefix: "topic/updateStatus" });
export const deleteOrRestore = createApiThunk({ prefix: "topic/deleteOrRestore" });
