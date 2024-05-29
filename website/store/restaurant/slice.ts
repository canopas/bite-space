import supabase from "@/utils/supabase";
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

export const getRestaurantData = async (suffix: any) => {
  if (suffix) {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", atob(suffix!))
      .single();

    return { data, error };
  }
  return { data: null, error: null };
};

export const getDishesData = async (suffix: any) => {
  if (suffix) {
    const { data: menusData, error } = await supabase
      .from("menus")
      .select("id, name, description, image")
      .eq("restaurant_id", atob(suffix!))
      .order("id", { ascending: true });

    if (error) return { data: null, error };

    const dishes = await Promise.all(
      menusData.map(async (menu: any) => {
        const { data: dishData, error: dishError } = await supabase
          .from("dishes")
          .select(
            "id, name, description, price, images, video, video_thumbnail"
          )
          .eq("menu_id", menu.id)
          .order("id", { ascending: true });

        if (dishError) return { data: null, dishError };

        return {
          ...menu,
          dishes: dishData,
        };
      })
    );

    const { data: menusSectionData, error: menusSectionError } = await supabase
      .from("menus_sections")
      .select("*")
      .eq("restaurant_id", atob(suffix!))
      .order("id", { ascending: true });

    if (error) return { data: null, error: menusSectionError };

    const menusWithSections: any = [];
    const menusWithoutSections: any = [];

    // Create a map of menu ids for quick lookup
    const menuMap = new Map();
    dishes.forEach((menu) => menuMap.set(menu.id, menu));

    // Iterate over the menus_sections array and construct the result
    menusSectionData?.forEach((section) => {
      const sectionMenus = section.menu_ids
        .map((menuId: number) => menuMap.get(menuId))
        .filter(Boolean);
      menusWithSections.push({
        id: section.id,
        name: section.name,
        menus: sectionMenus,
      });
    });

    // Find menus that do not belong to any section
    const sectionMenuIds = new Set(
      menusSectionData?.flatMap((section) => section.menu_ids)
    );
    dishes.forEach((menu) => {
      if (!sectionMenuIds.has(menu.id)) {
        menusWithoutSections.push(menu);
      }
    });

    return {
      data: { menus: menusWithoutSections, menuSections: menusWithSections },
      error: null,
    };
  }
  return { data: null, error: null };
};

export const getMenuDishes = async (suffix: any, menuSuffix: any) => {
  if (suffix && menuSuffix) {
    const { data, error } = await supabase
      .from("menus")
      .select("id, name")
      .eq("restaurant_id", atob(suffix!))
      .eq("id", atob(menuSuffix!))
      .single();

    if (error) return { data: null, error };

    if (data) {
      const { data: dishData, error: dishError } = await supabase
        .from("dishes")
        .select("id, name, description, price, images, video, video_thumbnail")
        .eq("menu_id", data.id)
        .order("id", { ascending: true });

      if (dishError) throw { data: null, error: dishError };

      return { data: { name: data.name, dishes: dishData }, error: null };
    }
  }
  return { data: null, error: null };
};

export const getRestaurantCategories = async (
  suffix: any,
  categorySuffix: any
) => {
  if (suffix && categorySuffix) {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, description, image")
      .eq("restaurant_id", atob(suffix!))
      .eq("id", atob(categorySuffix!))
      .single();

    if (error) return { data: null, error };

    if (data) {
      const { data: dishData, error: dishError } = await supabase
        .from("dishes")
        .select("id, name, description, price, images, video, video_thumbnail")
        .eq("category_id", data.id)
        .order("id", { ascending: true });

      if (dishError) return { data: null, error: dishError };

      return { data: { category: data, dishes: dishData }, error: null };
    }
  }
  return { data: null, error: null };
};
