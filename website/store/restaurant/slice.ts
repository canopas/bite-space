import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RestaurantState {
  restaurants: any;
  categories: any;
  menus: any;
}

const initialState: RestaurantState = {
  restaurants: [],
  categories: [],
  menus: [],
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurantsState: (state, action: PayloadAction<any>) => {
      state.restaurants = [...state.restaurants, action.payload];
    },
    setCategoryState: (state, action: PayloadAction<any>) => {
      state.categories = [...state.categories, action.payload];
    },
    setMenusState: (state, action: PayloadAction<any>) => {
      state.menus = [...state.menus, action.payload];
    },
  },
});

export const { setRestaurantsState, setCategoryState, setMenusState } =
  restaurantSlice.actions;

export const restaurantReducer = restaurantSlice.reducer;
