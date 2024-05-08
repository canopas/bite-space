import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { homeReducer } from "@/store/home/slice";
import { categoryReducer } from "@/store/category/slice";
import { restaurantReducer } from "@/store/restaurant/slice";
import { appReducer } from "./slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    home: homeReducer,
    category: categoryReducer,
    restaurant: restaurantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
