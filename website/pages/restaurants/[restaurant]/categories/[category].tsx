"use client";

import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import supabase from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import NotFound from "@/components/PageNotFound";
import NoHeaderFooterLayout from "@/components/Layout/noHeaderFooter";
import Reels from "@/components/Reel";
import RootLayout from "@/components/Layout/root";
import SectionTitle from "@/components/Common/SectionTitle";
import MenuDishSkeleton from "@/components/SkeletonPlaceholders/MenuDish";
import VideoPlayer from "@/components/VideoPlayer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCategoryState, setDishesState } from "@/store/category/slice";
import withScrollRestoration from "@/components/withScrollRestoration";
import NoDataFound from "@/components/NoDataFound";
import { getRestaurantCategories } from "@/store/restaurant/slice";

const RestaurantCategory = ({
  categoryInfo,
  dishes,
}: {
  categoryInfo: any;
  dishes: any;
}) => {
  const router = useRouter();
  const { restaurant, category } = router.query;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);
  const categorySuffix = category
    ?.toString()
    .substring(category?.lastIndexOf("-") + 1);

  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const categoriesState = useAppSelector((state) => state.category.categories);
  const categoryDishesState = useAppSelector((state) => state.category.dishes);

  const [isDishesLoading, setIsDishesLoading] = useState(
    categoryInfo ? false : true
  );
  const [dishesData, setDishesData] = useState<any>(dishes);
  const [categoryData, setCategoryData] = useState<any>(categoryInfo);

  useEffect(() => {
    const fetchCategories = async () => {
      if (dishesData) return;

      if (suffix && categorySuffix) {
        try {
          const { data, error } = await getRestaurantCategories(
            suffix,
            categorySuffix
          );
          if (error) return error;

          if (data) {
            dispatch(
              setCategoryState({ id: categorySuffix!, data: data.category })
            );
            setCategoryData(data.category);

            dispatch(
              setDishesState({ id: categorySuffix!, data: data.dishes })
            );
            setDishesData(data.dishes);
          }
        } catch (error) {
          console.error("Error fetching dishes data:", error);
        } finally {
          setIsDishesLoading(false);
        }
      }
    };

    if (!categoryInfo) {
      if (categoriesState.length > 0) {
        if (categoriesState.some((item: any) => item.id == categorySuffix!)) {
          setCategoryData(
            categoriesState.filter(
              (item: any) => item.id === categorySuffix!
            )[0].data
          );
          setDishesData(
            categoryDishesState.filter(
              (item: any) => item.id === categorySuffix!
            )[0].data
          );
          setIsDishesLoading(false);
        } else {
          fetchCategories();
        }
      } else if (categoriesState.length == 0) {
        fetchCategories();
      }
    }
  }, [categorySuffix, suffix, categoryInfo]);

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {categoryData ? (
        <>
          <div className="hidden sm:block animated-fade">
            <RootLayout>
              <section className="py-16 md:py-20 lg:py-28">
                <div className="container">
                  <SectionTitle
                    title={categoryData.name}
                    paragraph={categoryData.description}
                    customClass={`mx-auto mb-16 mt-20 ${
                      !isPageReset ? "animated-fade-y" : ""
                    }`}
                  />
                  {isDishesLoading ? (
                    <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <MenuDishSkeleton
                          key={"category-menu-dish-skeleton-" + index}
                          classes="h-[30rem]"
                        />
                      ))}
                    </div>
                  ) : dishesData.length > 0 ? (
                    <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {dishesData.map((data: any) => (
                        <div
                          key={"desktop-dish-" + data.id}
                          id={"desktop-dish-" + data.id}
                          className={`relative w-full h-[30rem] ${
                            !isPageReset ? "animated-fade-y" : ""
                          }`}
                        >
                          {data.video ? (
                            <VideoPlayer
                              src={data.video}
                              poster={data.video_thumbnail}
                              classes={"h-full w-full rounded-xl object-cover"}
                            />
                          ) : (
                            <Swiper
                              modules={[Autoplay, EffectFade]}
                              slidesPerView={1}
                              loop={true}
                              autoplay={true}
                              effect="fade"
                              className="h-full w-full rounded-xl"
                            >
                              {data.images.map((data: any) => (
                                <div
                                  key={"desktop-image-" + data}
                                  id={"image-" + data}
                                >
                                  <SwiperSlide>
                                    <Image
                                      src={data}
                                      fill
                                      alt="menu-dish-image"
                                      className="h-full w-full object-cover"
                                    />
                                  </SwiperSlide>
                                </div>
                              ))}
                            </Swiper>
                          )}
                          <div className="absolute top-0 z-[1] h-full w-full rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent">
                            <div className="w-full absolute bottom-0 flex flex-col gap-2 px-4 pb-4 text-gray-200 dark:text-gray-300">
                              <div className="flex items-center justify-between gap-5 text-xl font-bold">
                                <p className="min-w-2/5 text-white">
                                  {data.name}
                                </p>
                                <p className="text-lg">₹{data.price}</p>
                              </div>
                              {data.description && data.description != "" ? (
                                <p className="border-t border-gray-300 border-opacity-30 text-xs pt-2">
                                  {data.description}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDataFound text="😕 Oops, No dishes available at the moment!" />
                  )}
                </div>
              </section>
            </RootLayout>
          </div>
          <div className="sm:hidden animated-fade">
            <NoHeaderFooterLayout>
              <header className="select-none header left-0 top-0 z-40 w-full items-center absolute p-3 flex gap-2 text-white">
                <button
                  onClick={goBack}
                  className="flex gap-2 items-center bg-primary bg-opacity-50 dark:bg-opacity-30 border-b border-primary dark:border-opacity-50 px-3 py-1 text-sm font-semibold rounded-lg"
                >
                  <span>{"<"}</span>
                  Back
                </button>
                <span>|</span>
                <p className="font-bold text-sm">{categoryData.name}</p>
              </header>
              <Reels
                dishesData={dishesData}
              />
            </NoHeaderFooterLayout>
          </div>
        </>
      ) : isDishesLoading ? (
        <div className="h-screen pb-20">
          <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

interface FetchCategoryDataResult {
  categoryInfo: any;
  dishes: any;
}

export async function getServerSideProps(context: any) {
  const { params, req } = context;
  const { restaurant, category } = params;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);
  const categorySuffix = category
    ?.toString()
    .substring(category?.lastIndexOf("-") + 1);

  if (req.url != "/restaurants/" + restaurant + "/categories/" + category) {
    return {
      props: {
        categoryInfo: null,
        dishes: null,
      },
    };
  }

  const fetchCategoryData = async (): Promise<
    FetchCategoryDataResult | undefined
  > => {
    if (suffix && categorySuffix) {
      try {
        const { data, error } = await getRestaurantCategories(
          suffix,
          categorySuffix
        );
        if (error) throw error;

        if (data) return { categoryInfo: data.category, dishes: data.dishes };
      } catch (error) {
        console.error("Error fetching dishes data:", error);
        return { categoryInfo: null, dishes: null };
      }
    }
  };

  const { categoryInfo, dishes }: { categoryInfo: any; dishes: any } =
    (await fetchCategoryData())!;

  return {
    props: {
      categoryInfo,
      dishes,
    },
  };
}

export default withScrollRestoration(RestaurantCategory);
