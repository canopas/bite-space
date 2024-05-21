import supabase from "@/utils/supabase";
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

export const getFoodCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", 0)
    .order("id", { ascending: true });

  if (error) return { data: null, error };

  return { data, error: null };
};

export const getItemCardData = async () => {
  // Fetch menu IDs associated with public restaurants
  const { data: menusData, error: menuError } = await supabase
    .from("menus")
    .select("id, restaurants(id)")
    .eq("restaurants.is_public", true)
    .not("restaurants", "is", null);

  if (menuError) return { data: null, error: menuError };

  // Extract menu IDs
  const menuIds = menusData.map((menu) => menu.id);

  // Fetch dishes associated with the obtained menu IDs
  const { data: dishesData, error: dishesError } = await supabase
    .from("dishes")
    .select("*, menus(id, restaurants(id, name, address))")
    .in("menu_id", menuIds)
    .order("id", { ascending: true })
    .limit(9);

  if (dishesError) return { data: null, error: dishesError };

  const restaurant = await Promise.all(
    dishesData.map(async (dish) => {
      return {
        ...dish,
        image: dish.images ? dish.images[0] : "",
        rating: 4.2,
      };
    })
  );

  return { data: restaurant, error: null };
};

export const getYouMayLikeData = async () => {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_public", true)
    .order("id", { ascending: true })
    .limit(4);

  if (error) return { data: null, error };

  return { data, error: null };
};

export const getCategoriesData = async (suffix: any) => {
  if (suffix) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", atob(suffix!))
      .single();

    if (error) return { data: null, error };

    const { data: categoryDatas, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, description, restaurant_id, image")
      .neq("restaurant_id", 0)
      .order("id", { ascending: false })
      .contains("tags", [data.name.toLowerCase()]);

    if (categoriesError) return { data: null, error: categoriesError };

    const restaurant = await Promise.all(
      categoryDatas.map(async (category) => {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("id, name, address")
          .eq("id", category.restaurant_id)
          .eq("is_public", true)
          .single();

        if (restaurantError)
          console.error("Error fetching restaurant details:", restaurantError);

        if (restaurantData) {
          return {
            ...restaurantData,
            category: category,
            rating: 0,
            reviews: 0,
          };
        } else {
          return {
            id: 0,
            name: "",
            address: "",
            category: category,
            rating: 0,
            reviews: 0,
          };
        }
      })
    );

    return { data: { category: data, restaurant }, error: null };
  }

  return { data: null, error: null };
};