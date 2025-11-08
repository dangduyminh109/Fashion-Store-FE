import createClientApiThunk from "~/utils/createClientApiThunk";

export const fetchBrand = createClientApiThunk({ prefix: "brand/fetchBrand" });
