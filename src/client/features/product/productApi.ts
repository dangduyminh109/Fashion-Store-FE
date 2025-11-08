import createClientApiThunk from "~/utils/createClientApiThunk";


export const fetchProduct = createClientApiThunk({ prefix: "product/fetchProduct" });
export const refillProduct = createClientApiThunk({ prefix: "product/refillProduct" });
export const fetchCategory = createClientApiThunk({ prefix: "product/fetchCategory" });