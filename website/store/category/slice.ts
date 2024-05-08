import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CategoryState {
  categories: any;
  restaurants: any;
  dishes: any;
}

const initialState: CategoryState = {
  categories: [],
  restaurants: [],
  dishes: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryState: (state, action: PayloadAction<any>) => {
      state.categories = [...state.categories, action.payload];
    },
    setRestaurantsState: (state, action: PayloadAction<any>) => {
      state.restaurants = [...state.restaurants, action.payload];
    },
    setDishesState: (state, action: PayloadAction<any>) => {
      state.dishes = [...state.dishes, action.payload];
    },
  },
});

export const { setCategoryState, setRestaurantsState, setDishesState } =
  categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
