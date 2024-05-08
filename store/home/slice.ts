import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface HomeState {
  categories: any;
  foodItems: any;
  restaurants: any;
}

const initialState: HomeState = {
  categories: [],
  foodItems: [],
  restaurants: [],
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setCategoriesState: (state, action: PayloadAction<any>) => {
      state.categories = action.payload;
    },
    setFoodItemsState: (state, action: PayloadAction<any>) => {
      state.foodItems = action.payload;
    },
    setRestaurantsState: (state, action: PayloadAction<any>) => {
      state.restaurants = action.payload;
    },
  },
});

export const { setCategoriesState, setFoodItemsState, setRestaurantsState } =
  homeSlice.actions;

export const homeReducer = homeSlice.reducer;
