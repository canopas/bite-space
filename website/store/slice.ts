import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  isPageReset: boolean;
  screenHeight: number;
}

const initialState: AppState = {
  isPageReset: false,
  screenHeight: 0,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsPageResetState: (state, action: PayloadAction<boolean>) => {
      state.isPageReset = action.payload;
    },
    setScreenHeightState: (state, action: PayloadAction<number>) => {
      state.screenHeight = action.payload;
    },
  },
});

export const { setIsPageResetState, setScreenHeightState } = appSlice.actions;
export const appReducer = appSlice.reducer;
