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
import Link from "next/link";

const RestaurantMenu = () => {
  const router = useRouter();
  const { restaurant, menu } = router.query;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);
  const menuSuffix = menu?.toString().substring(menu?.lastIndexOf("-") + 1);

  const [screenHeight, setScreenHeight] = useState<number>(0);

  const [isDishesLoading, setIsDishesLoading] = useState(true);
  const [menuData, setMenuData] = useState<any>(null);
  const [menuName, setMenuName] = useState<string>("");

  useEffect(() => {
    setScreenHeight(window.innerHeight);

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

    window.addEventListener("resize", () =>
      setScreenHeight(window.innerHeight)
    );

    return () =>
      window.removeEventListener("resize", () =>
        setScreenHeight(window.innerHeight)
      );
  }, [carouselRef, numDivsToRender, menuData?.length]);

  const goBack = () => {
    router.back();
  };

  return (
    <>
      {menuData ? (
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
          <section className="select-none animated-fade">
            <div
              className="reelsContainer scrollbar-hidden animated-fade"
              style={{
                height: screenHeight != 0 ? screenHeight + "px" : "100vh",
              }}
            >
              {isDishesLoading ? (
                <div className="reelsContainer scrollbar-hidden w-full">
                  <MenuDishSkeleton classes="reel" />
                </div>
              ) : (
                <div
                  ref={carouselRef}
                  className="reelsContainer scrollbar-hidden w-full"
                  style={{
                    height: screenHeight != 0 ? screenHeight + "px" : "100vh",
                  }}
                >
                  {menuData
                    .slice(0, numDivsToRender)
                    .map((data: any, index: any) => (
                      <div
                        key={"menu-dish-key-" + index}
                        id={`menu-dish-${index}`}
                        className={`reel relative carousel-item ${
                          data ? "animated-fade" : ""
                        }`}
                        style={{
                          height:
                            screenHeight != 0 ? screenHeight + "px" : "100vh",
                        }}
                      >
                        {data.video ? (
                          <VideoPlayer
                            src={data.video}
                            poster={data.video_thumbnail}
                            classes={"h-full w-full object-cover"}
                          />
                        ) : (
                          <Swiper
                            modules={[Autoplay, EffectFade]}
                            slidesPerView={1}
                            loop={true}
                            autoplay={true}
                            effect="fade"
                            className="w-full"
                            style={{
                              height:
                                screenHeight != 0
                                  ? screenHeight + "px"
                                  : "100vh",
                            }}
                          >
                            {data.images.map((data: any, index: number) => (
                              <div key={"mobile-image-" + index}>
                                <SwiperSlide>
                                  <div
                                    className="h-full"
                                    style={{
                                      backgroundImage: `url(${data})`,
                                    }}
                                  >
                                    <div className="flex h-full w-full items-center bg-black bg-opacity-20 backdrop-blur-sm">
                                      <Image
                                        src={data}
                                        height={100}
                                        width={100}
                                        alt="menu-dish-image"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </SwiperSlide>
                              </div>
                            ))}
                          </Swiper>
                        )}
                        <div className="absolute bottom-0 z-[1] flex h-full w-full flex-col gap-3 bg-gradient-to-t from-black/80 via-transparent to-black/60 p-5 pb-10 text-white">
                          <div className="flex h-full items-end justify-between gap-5 border-b border-white/10 pb-2 text-xl font-bold">
                            <p className="min-w-2/5">{data.name}</p>
                            <p className="text-lg text-white/70">
                              ₹{data.price}
                            </p>
                          </div>
                          <p className="text-sm">{data.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </NoHeaderFooterLayout>
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
