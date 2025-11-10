import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchProduct, refillProduct } from "./productApi";
import type ProductFeatured from "~/client/types/productFeatured";

interface initialStateType {
  title: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
  sort: "default" | "a-z" | "z-a" | "desc" | "asc";
  listProduct: ProductFeatured[];
  filters: {
    brands: Record<string, boolean>;
    attributes: Record<string, Record<string, boolean>>;
    prices: Record<string, boolean>;
    categorys: Record<string, boolean>;
  };
  page: number;
  size: number;
  totalPage: number;
  error: any;
}

const initialState: initialStateType = {
  title: "Danh Sách Sản Phẩm",
  loading: "idle",
  sort: "default",
  listProduct: [],
  filters: {
    brands: {},
    attributes: {},
    prices: {},
    categorys: {},
  },
  page: 0,
  size: 8,
  totalPage: 1,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    clearFilters: (state, _) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setCategory: (state, action) => {
      state.filters.categorys = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    toggleFilter: (
      state,
      action: PayloadAction<{
        group: keyof initialStateType["filters"];
        key: string;
        attributeGroup?: string;
      }>
    ) => {
      const { group, key, attributeGroup } = action.payload;
      if (!state.filters[group]) {
        state.filters[group] = {};
      }
      if (group === "attributes") {
        const ag = attributeGroup!;
        if (!state.filters.attributes[ag]) {
          state.filters.attributes[ag] = {};
        }
        const current = !!state.filters.attributes[ag][key];
        state.filters.attributes[ag][key] = !current;
      } else {
        if (!(state.filters as any)[group]) {
          (state.filters as any)[group] = {};
        }
        const current = !!(state.filters as any)[group][key];
        (state.filters as any)[group][key] = !current;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state, _) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.listProduct = action.payload.result.listProduct;
        state.totalPage = action.payload.result.totalPage;
        state.page = 0;
        state.loading = "succeeded";
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error;
      })

      .addCase(refillProduct.pending, (state, _) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(refillProduct.fulfilled, (state, action) => {
        const result = action.payload.result;
        state.listProduct = [...state.listProduct, ...result.listProduct];

        if (result.totalPage != state.totalPage) {
          state.totalPage = result.totalPage;
          state.page = Math.floor(result.totalPage / state.size);
        } else {
          state.page = state.page + 1;
        }
      })
      .addCase(refillProduct.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error;
      });
  },
});
export const { setSort, toggleFilter, setPage, setCategory, setTitle } = productSlice.actions;
export default productSlice.reducer;
