"use client";

import supabase from "@/utils/supabase";

import SectionTitle from "@/components/Common/SectionTitle";
import { useEffect, useState } from "react";
import { CategoryData, RestaurantData } from "@/types/category-by-id";
import { useRouter } from "next/router";
import Restaurant from "./restaurant";
import RootLayout from "../../components/Layout/root";
import NotFound from "@/components/PageNotFound";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCategoryState, setRestaurantsState } from "@/store/category/slice";
import withScrollRestoration from "@/components/withScrollRestoration";

const Category = () => {
  const router = useRouter();
  const { category } = router.query;
  const suffix = category?.toString().substring(category?.lastIndexOf("-") + 1);

  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const categoriesState = useAppSelector((state) => state.category.categories);
  const categoryRestaurantsState = useAppSelector(
    (state) => state.category.restaurants
  );

  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [restaurantsData, setCategoriesRestaurantsData] = useState<
    RestaurantData[]
  >([]);

  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (
        categoryRestaurantsState.some((item: any) => item.id === atob(suffix!))
      ) {
        return;
      }

      if (suffix) {
        try {
          const { data, error } = await supabase
            .from("categories")
            .select("*")
            .eq("id", atob(suffix!))
            .single();

          if (error) throw error;

          dispatch(setCategoryState({ id: atob(suffix!), data: data }));
          setCategoryData(data);

          const { data: categoryDatas, error: categoriesError } = await supabase
            .from("categories")
            .select("id, name, description, restaurant_id, image")
            .neq("restaurant_id", 0)
            .order("id", { ascending: false })
            .contains("tags", [data.name.toLowerCase()]);

          if (categoriesError) throw categoriesError;

          const restaurant = await Promise.all(
            categoryDatas.map(async (category) => {
              const { data: restaurantData, error: restaurantError } =
                await supabase
                  .from("restaurants")
                  .select("id, name, address")
                  .eq("id", category.restaurant_id)
                  .eq("is_public", true)
                  .single();

              if (restaurantError)
                console.error(
                  "Error fetching restaurant details:",
                  restaurantError
                );

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

          dispatch(
            setRestaurantsState({ id: atob(suffix!), data: restaurant })
          );

          setCategoriesRestaurantsData(restaurant);
        } catch (error) {
          console.error("Error fetching category data:", error);
        } finally {
          setIsRestaurantsLoading(false);
        }
      }
    };

    if (categoriesState.length > 0) {
      if (categoriesState.some((item: any) => item.id == atob(suffix!))) {
        setCategoryData(
          categoriesState.filter((item: any) => item.id === atob(suffix!))[0]
            .data
        );
        setCategoriesRestaurantsData(
          categoryRestaurantsState.filter(
            (item: any) => item.id === atob(suffix!)
          )[0].data
        );
        setIsRestaurantsLoading(false);
      } else {
        fetchCategoryData();
      }
    } else if (categoriesState.length == 0) {
      fetchCategoryData();
    }
  }, [dispatch, suffix]);

  return (
    <>
      {categoryData ? (
        <RootLayout>
          <section className="py-16 md:py-20 lg:py-28">
            <div className="container animated-fade">
              <SectionTitle
                title={categoryData.name}
                paragraph={categoryData.description}
                customClass={`mx-auto mb-16 mt-20 ${
                  !isPageReset ? "animated-fade-y" : ""
                }`}
              />
              <Restaurant
                isRestaurantsLoading={isRestaurantsLoading}
                restaurantsData={restaurantsData}
              />
            </div>
          </section>
        </RootLayout>
      ) : isRestaurantsLoading ? (
        <div className="container flex flex-col gap-10 mt-20">
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 h-10 w-1/2"></div>
          <div className="mx-auto animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 h-10 w-full"></div>
          <div className="mt-10 grid h-80 grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:h-60 xl:grid-cols-3">
            <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
            <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
            <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
            <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
            <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
            <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default withScrollRestoration(Category);