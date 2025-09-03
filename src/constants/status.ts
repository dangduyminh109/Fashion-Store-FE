export const STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

export type StatusType = (typeof STATUS)[keyof typeof STATUS];
