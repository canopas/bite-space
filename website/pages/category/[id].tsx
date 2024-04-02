"use client";

import supabase from "@/utils/supabase";

import SectionTitle from "@/components/Common/SectionTitle";
import { useEffect, useState } from "react";
import { CategoryData, RestaurantData } from "@/types/category-by-id";
import { useRouter } from "next/router";
import Restaurant from "./restaurant";
import RootLayout from "../layout";

const Category = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [restaurantsData, setRestaurantsData] = useState<RestaurantData[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setCategoryData(data);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, restaurant_id, image")
          .neq("restaurant_id", 0)
          .contains("tags", [data.name.toLowerCase()]);

        if (categoriesError) throw categoriesError;

        const restaurant = await Promise.all(
          categoriesData.map(async (category) => {
            const { data: restaurantData, error: restaurantError } =
              await supabase
                .from("restaurants")
                .select("id, name, address")
                .eq("id", category.restaurant_id)
                .single();

            if (restaurantError) throw restaurantError;

            return {
              ...restaurantData,
              image: category.image,
              rating: 0,
              reviews: 0,
            };
          })
        );

        setRestaurantsData(restaurant);
        setIsRestaurantsLoading(false);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [id]);

  return (
    <RootLayout>
      <section className="py-16 md:py-20 lg:py-28">
        {!isRestaurantsLoading && categoryData ? (
          <div className="container">
            <SectionTitle
              title={categoryData.name}
              paragraph={categoryData.description}
              customClass="mx-auto mb-16 mt-20 capitalize animated-fade-y"
            />
            <Restaurant
              isLoading={isRestaurantsLoading}
              restaurantsData={restaurantsData}
            />
          </div>
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
          <div className="flex h-screen w-full items-center justify-center text-black/50 dark:text-white/70">
            No Data Found
          </div>
        )}
      </section>
    </RootLayout>
  );
};

export default Category;
