import createClientApiThunk from "~/utils/createClientApiThunk";

export const fetchPost = createClientApiThunk({ prefix: "post/fetchPost" });
export const refillPost = createClientApiThunk({ prefix: "post/refillPost" });