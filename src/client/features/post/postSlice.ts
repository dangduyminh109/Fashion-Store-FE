import { createSlice } from "@reduxjs/toolkit";
import { fetchPost, refillPost } from "./postApi";
import type PostFeatured from "~/client/types/postFeatured";

interface initialStateType {
  title: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
  listPost: PostFeatured[];
  topicId: number | null;
  page: number;
  size: number;
  totalPage: number;
  error: any;
}

const initialState: initialStateType = {
  title: "Danh Sách Bài Viết",
  loading: "idle",
  listPost: [],
  page: 0,
  topicId: null,
  size: 3,
  totalPage: 1,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTopicId: (state, action) => {
      state.topicId = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state, _) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.listPost = action.payload.result.listPost;
        state.totalPage = action.payload.result.totalPage;
        state.page = 0;
        state.loading = "succeeded";
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error;
      })

      .addCase(refillPost.pending, (state, _) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(refillPost.fulfilled, (state, action) => {
        const result = action.payload.result;
        state.listPost = [...state.listPost, ...result.listPost];

        if (result.totalPage != state.totalPage) {
          state.totalPage = result.totalPage;
          state.page = Math.floor(result.totalPage / state.size);
        } else {
          state.page = state.page + 1;
        }
        state.loading = "succeeded";
      })
      .addCase(refillPost.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error;
      });
  },
});
export const { setPage, setTopicId, setTitle } = postSlice.actions;
export default postSlice.reducer;
