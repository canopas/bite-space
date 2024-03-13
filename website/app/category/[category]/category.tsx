"use client";

import supabase from "@/utils/supabase";

import SectionTitle from "@/components/Common/SectionTitle";
import Restaurants from "./restaurant";
import { useEffect, useState } from "react";

const Category = ({ paramsData }: { paramsData: { category: string } }) => {
  const [categoryData, setCategoryData] = useState<any>({});
  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);
  const [restaurantsData, setRestaurantsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", paramsData.category)
          .single();

        if (error) throw error;

        setCategoryData(data);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("id, restaurant_id, image")
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
        console.error("Error fetching category data:", error.message);
      }
    };

    fetchCategoryData();
  }, [paramsData.category]);

  return (
    <section className="py-16 md:py-20 lg:py-28">
      {categoryData ? (
        <div className="container">
          <SectionTitle
            title={categoryData.name}
            paragraph={categoryData.description}
            customClass="mx-auto mb-16 mt-20 capitalize animated-fade-y"
          />
          {/* {!isRestaurantsLoading ? (
            <div className="animated-fade-y mb-5 grid w-full grid-cols-2 gap-5 sm:grid-cols-4 lg:w-2/3 xl:w-1/2">
              <button className="rounded-full border border-black px-5 py-2 font-semibold transition-all duration-500 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                Filter
              </button>
              <button className="rounded-full border border-black px-5 py-2 font-semibold transition-all duration-500 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                Pure Veg
              </button>
              <button className="rounded-full border border-black px-5 py-2 font-semibold transition-all duration-500 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                Price
              </button>
              <button className="rounded-full border border-black px-5 py-2 font-semibold transition-all duration-500 hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black">
                Place
              </button>
            </div>
          ) : (
            ""
          )} */}
          <Restaurants
            isLoading={isRestaurantsLoading}
            restaurantsData={restaurantsData}
          />
        </div>
      ) : (
        <div className="flex h-screen w-full items-center justify-center text-black/50 dark:text-white/70">
          No Data Found
        </div>
      )}
    </section>
  );
};

export default Category;
