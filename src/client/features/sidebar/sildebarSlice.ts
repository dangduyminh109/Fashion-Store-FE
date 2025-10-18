import { createSlice } from "@reduxjs/toolkit";
import { fetchSidebar } from "./sidebarApi";
import type CategoryTree from "~/client/types/categoryTree";

interface initialStateType {
  isOpen: boolean;
  isSubCategory: boolean;
  categoryData?: CategoryTree[];
  currentCategory?: CategoryTree;
}

const initialState: initialStateType = {
  isOpen: false,
  isSubCategory: false,
  categoryData: [],
  currentCategory: undefined,
};

function findParent(
  rootCategories: CategoryTree[] | undefined,
  targetId: number
): CategoryTree | null {
  for (const category of rootCategories || []) {
    if (category.children?.some((child: CategoryTree) => child.id === targetId)) {
      return category;
    }
    if (category.children) {
      const found = findParent(category.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    changeCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.isSubCategory = true;
    },
    prevCurrentCategory: (state, action) => {
      const parent = findParent(state.categoryData, action.payload.id);
      if (!parent) {
        state.currentCategory = undefined;
        state.isSubCategory = false;
      } else {
        state.currentCategory = parent ? parent : undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSidebar.fulfilled, (state, action) => {
      state.categoryData = action.payload.result || [];
      state.currentCategory = action.payload.result || [];
    });
  },
});

export default sidebarSlice.reducer;
