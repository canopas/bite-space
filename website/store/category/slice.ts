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
  const menuIds = menusData.map((menu: any) => menu.id);

  // Fetch dishes associated with the obtained menu IDs
  const { data: dishesData, error: dishesError } = await supabase
    .from("dishes")
    .select("*, menus(id, restaurants(id, name, address))")
    .in("menu_id", menuIds)
    .order("id", { ascending: false })
    .limit(9);

  if (dishesError) return { data: null, error: dishesError };

  const restaurant = await Promise.all(
    dishesData.map(async (dish: any) => {
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
    .limit(6);

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

    const { data: menuDatas, error: menuError } = await supabase
      .from("menus")
      .select("id, restaurant_id, name, description, image")
      .order("id", { ascending: false })
      .contains("tags", [data.name.toLowerCase()]);

    if (menuError) return { data: null, error: menuError };

    const restaurants = await Promise.all(
      menuDatas.map(async (menu: any) => {
        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("id, name, address")
          .eq("id", menu.restaurant_id)
          .eq("is_public", true)
          .single();

        if (restaurantError)
          console.error("Error fetching restaurant details:", restaurantError);

        const { data: dishData, error: dishError } = await supabase
          .from("dishes")
          .select(
            "id, name, description, price, images, video, video_thumbnail"
          )
          .eq("menu_id", menu.id)
          .order("id", { ascending: true });

        if (dishError) return { data: null, error: dishError };

        if (restaurantData) {
          return {
            ...restaurantData,
            menu: menu,
            dishes: dishData,
            rating: 0,
            reviews: 0,
          };
        } else {
          return {
            id: 0,
            name: "",
            address: "",
            menu: menu,
            dishes: [],
            rating: 0,
            reviews: 0,
          };
        }
      })
    );

    const restaurant = mergeById(restaurants);

    return { data: { menu: data, restaurant }, error: null };
  }

  return { data: null, error: null };
};

interface MergedRestaurant {
  address: string;
  id: number;
  menu: any[];
  name: string;
}

function mergeById(array: any[]): MergedRestaurant[] {
  const mergedData: { [key: number]: MergedRestaurant } = {};

  array.forEach((item) => {
    if (!mergedData[item.id]) {
      mergedData[item.id] = {
        address: item.address,
        id: item.id,
        name: item.name,
        menu: [{ ...item.menu, dishes: [...item.dishes] }],
      };
    } else {
      const existingMenus = mergedData[item.id].menu;
      const existingMenu = existingMenus.find((m) => m.id === item.menu.id);

      if (existingMenu) {
        existingMenu.dishes = [...existingMenu.dishes, ...item.dishes];
      } else {
        existingMenus.push({ ...item.menu, dishes: [...item.dishes] });
      }
    }
  });

  return Object.values(mergedData);
}
