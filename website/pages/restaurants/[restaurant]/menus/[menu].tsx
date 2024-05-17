"use client";

import supabase from "@/utils/supabase";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import { useRouter } from "next/router";
import NotFound from "@/components/PageNotFound";
import VideoPlayer from "@/components/VideoPlayer";
import MenuDishSkeleton from "@/components/SkeletonPlaceholders/MenuDish";
import NoHeaderFooterLayout from "@/components/Layout/noHeaderFooter";
import Reels from "@/components/Reel";
import RootLayout from "@/components/Layout/root";
import SectionTitle from "@/components/Common/SectionTitle";
import { useAppSelector } from "@/store/store";
import NoDataFound from "@/components/NoDataFound";

const RestaurantMenu = () => {
  const router = useRouter();
  const { restaurant, menu } = router.query;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);
  const menuSuffix = menu?.toString().substring(menu?.lastIndexOf("-") + 1);

  const isPageReset = useAppSelector((state) => state.app.isPageReset);

  const [isDishesLoading, setIsDishesLoading] = useState(true);
  const [menuData, setMenuData] = useState<any>(null);
  const [menuName, setMenuName] = useState<string>("");

  useEffect(() => {
    const fetchDishes = async () => {
      if (menuData) return;

      if (suffix && menuSuffix) {
        try {
          const { data, error } = await supabase
            .from("menus")
            .select("id, name")
            .eq("restaurant_id", atob(suffix!))
            .eq("id", atob(menuSuffix!))
            .single();

          if (error) return error;

          if (data) {
            setMenuName(data.name);

            const { data: dishData, error: dishError } = await supabase
              .from("dishes")
              .select(
                "id, name, description, price, images, video, video_thumbnail"
              )
              .eq("menu_id", data.id)
              .order("id", { ascending: true });

            if (dishError) throw dishError;

            setMenuData(dishData);
          }
        } catch (error) {
          console.error("Error fetching dishes data:", error);
        } finally {
          setIsDishesLoading(false);
        }
      }
    };

    fetchDishes();
  }, [suffix, menuSuffix, menuData]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [numDivsToRender, setNumDivsToRender] = useState(2); // Initial number of dish to render

  useEffect(() => {
    const observerOptions = {
      root: null, // The viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the dish is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Increase the number of dish to render
          setNumDivsToRender((prevNumDivs) =>
            Math.min(prevNumDivs + 1, menuData?.length)
          );
        }
      });
    }, observerOptions);

    const currentCarouselRef = carouselRef.current;
    if (currentCarouselRef) {
      // Observe the last dish to trigger additional dish loading
      const lastDiv = currentCarouselRef.querySelector(
        `#menu-dish-${numDivsToRender - 1}`
      );
      if (lastDiv) {
        observer.observe(lastDiv);
      }

      return () => {
        if (lastDiv) {
          observer.unobserve(lastDiv);
        }
      };
    }
  }, [carouselRef, numDivsToRender, menuData?.length]);

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {menuData ? (
        <>
          <div className="hidden sm:block animated-fade">
            <RootLayout>
              <section className="py-16 md:py-20 lg:py-28">
                <div className="container">
                  <SectionTitle
                    title={menuName + " Dishes"}
                    paragraph={""}
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
                  ) : menuData.length > 0 ? (
                    <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {menuData.map((data: any) => (
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
                              <div className="flex items-center justify-between gap-5 border-b border-gray-300 border-opacity-30 pb-1 text-xl font-bold">
                                <p className="min-w-2/5 text-white">
                                  {data.name}
                                </p>
                                <p className="text-lg">₹{data.price}</p>
                              </div>
                              <p className="text-xs">{data.description}</p>
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
                <p className="font-bold text-sm">{menuName} dishes</p>
              </header>
              <Reels dishesData={menuData} isDishesLoading={isDishesLoading} />
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

export default RestaurantMenu;
