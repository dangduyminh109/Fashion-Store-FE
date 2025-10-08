import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "~/admin/hooks/useFetch";
import type Response from "~/admin/types/response";

export interface Params {
  url: string;
  method: string;
  [key: string]: any;
}

export default function createApiThunk({ prefix }: { prefix: string }) {
  return createAsyncThunk<Response, Params, { rejectValue: Response }>(
    prefix,
    async ({ url, method, ...rest }, { rejectWithValue }) => {
      try {
        const res = await axiosClient.request({
          url,
          method,
          params: { ...rest },
        });
        if (res.data?.code === 9400 || res.data?.code === 9401) {
          return rejectWithValue({
            code: res.data.code,
            message: res.data?.message,
            result: res.data?.result,
          });
        }
        return res.data as Response;
      } catch (err: any) {
        return rejectWithValue({
          code: err.response.data?.code,
          message: err.response.data?.message,
          result: err.response.data?.result,
        });
      }
    }
  );
}
