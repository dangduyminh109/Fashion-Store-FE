import createApiThunk from "../../../utils/createApiThunk";

export const fetchAttribute = createApiThunk({ prefix: "attribute/fetchAttribute" });
export const deleteOrRestore = createApiThunk({ prefix: "attribute/deleteOrRestore" });
