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
import {
  getCategoriesData,
  setCategoryState,
  setRestaurantsState,
} from "@/store/category/slice";
import withScrollRestoration from "@/components/withScrollRestoration";

const Category = ({
  categoryInfo,
  restaurants,
}: {
  categoryInfo: CategoryData;
  restaurants: RestaurantData[];
}) => {
  const router = useRouter();
  const { category } = router.query;
  const suffix = category?.toString().substring(category?.lastIndexOf("-") + 1);

  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const categoriesState = useAppSelector((state) => state.category.categories);
  const categoryRestaurantsState = useAppSelector(
    (state) => state.category.restaurants
  );

  const [categoryData, setCategoryData] = useState<CategoryData | null>(
    categoryInfo
  );
  const [restaurantsData, setCategoriesRestaurantsData] = useState<
    RestaurantData[] | null
  >(restaurants);

  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(
    categoryInfo ? false : true
  );

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (
        categoryRestaurantsState.some((item: any) => item.id === atob(suffix!))
      ) {
        return;
      }

      if (suffix) {
        try {
          const { data, error } = await getCategoriesData(suffix);
          if (error) throw error;

          if (data) {
            dispatch(
              setCategoryState({ id: atob(suffix!), data: data.category })
            );
            setCategoryData(data.category);

            dispatch(
              setRestaurantsState({ id: atob(suffix!), data: data.restaurant })
            );
            setCategoriesRestaurantsData(data.restaurant);
          }
        } catch (error) {
          console.error("Error fetching category data:", error);
        } finally {
          setIsRestaurantsLoading(false);
        }
      }
    };

    if (!categoryInfo) {
      if (categoriesState.length > 0) {
        if (categoriesState.some((item: any) => item.id == atob(suffix!))) {
          setCategoryData(
            categoriesState.filter((item: any) => item.id === atob(suffix!))[0]
              .data
          );
          setCategoriesRestaurantsData(
            categoryRestaurantsState.filter(
              (item: any) => item.id === atob(suffix!)
            )[0]?.data
          );
          setIsRestaurantsLoading(false);
        } else {
          fetchCategoryData();
        }
      } else if (categoriesState.length == 0) {
        fetchCategoryData();
      }
    }
  }, [dispatch, suffix, categoryInfo]);

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
              {restaurantsData ? (
                <Restaurant
                  isRestaurantsLoading={isRestaurantsLoading}
                  restaurantsData={restaurantsData}
                />
              ) : (
                ""
              )}
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

interface FetchCategoryDataResult {
  categoryInfo: CategoryData | null;
  restaurants: RestaurantData[] | null;
}

export async function getServerSideProps(context: any) {
  const { params, req } = context;
  const { category } = params;
  const suffix = category?.toString().substring(category?.lastIndexOf("-") + 1);

  if (req.url != "/category/" + category) {
    return {
      props: {
        categoryInfo: null,
        restaurants: [],
      },
    };
  }

  const fetchCategoryData = async (): Promise<
    FetchCategoryDataResult | undefined
  > => {
    if (suffix) {
      try {
        const { data, error } = await getCategoriesData(suffix);
        if (error) throw error;

        if (data) {
          return { categoryInfo: category, restaurants: data?.restaurant };
        }

        return { categoryInfo: null, restaurants: [] };
      } catch (error) {
        console.error("Error fetching category data:", error);
        return { categoryInfo: null, restaurants: [] };
      }
    }
  };

  const {
    categoryInfo,
    restaurants,
  }: {
    categoryInfo: CategoryData | null;
    restaurants: RestaurantData[] | null;
  } = (await fetchCategoryData())!;

  return {
    props: {
      categoryInfo,
      restaurants,
    },
  };
}

export default withScrollRestoration(Category);
