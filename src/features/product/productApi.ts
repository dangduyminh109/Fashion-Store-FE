import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "~/hooks/useFetch";
import type Response from "~/types/response";

export const fetchProduct = createAsyncThunk<
  Response,
  Record<string, any> | void,
  { rejectValue: Response }
>("product/fetchProduct", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/product", { params });

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
});

interface UpdateStatusParams {
  url: string;
  method: string;
  [key: string]: any;
}

export const updateStatus = createAsyncThunk<
  Response,
  UpdateStatusParams,
  { rejectValue: Response }
>("product/updateStatus", async ({ url, method, ...rest }, { rejectWithValue }) => {
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
});

interface DeleteOrRestoreParams {
  url: string;
  method: string;
  [key: string]: any;
}

export const deleteOrRestore = createAsyncThunk<
  Response,
  DeleteOrRestoreParams,
  { rejectValue: Response }
>("product/deleteOrRestore", async ({ url, method, ...rest }, { rejectWithValue }) => {
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
});
