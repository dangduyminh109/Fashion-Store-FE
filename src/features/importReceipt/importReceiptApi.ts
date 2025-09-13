import createApiThunk from "../../utils/createApiThunk";

export const fetchImportReceipt = createApiThunk({ prefix: "importReceipt/fetchImportReceipt" });
export const deleteOrRestore = createApiThunk({ prefix: "importReceipt/deleteOrRestore" });
