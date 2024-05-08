import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  isPageReset: boolean;
}

const initialState: AppState = {
  isPageReset: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsPageResetState: (state, action: PayloadAction<boolean>) => {
      state.isPageReset = action.payload;
    },
  },
});

export const { setIsPageResetState } = appSlice.actions;
export const appReducer = appSlice.reducer;
