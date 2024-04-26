"use client";

import supabase from "@/utils/supabase";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import { useRouter } from "next/router";
import NotFound from "@/components/PageNotFound";
import VideoPlayer from "@/components/VideoPlayer";
import MenuDish from "@/components/SkeletonPlaceholders/MenuDish";
import LayoutWithoutFooter from "@/components/Layout/withoutFooter";

const RestaurantMenu = () => {
  const router = useRouter();
  const { restaurant, menu } = router.query;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);
  const menuSuffix = menu?.toString().substring(menu?.lastIndexOf("-") + 1);

  const [isDishesLoading, setIsDishesLoading] = useState(true);
  const [menuData, setMenuData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDishes = async () => {
      if (suffix) {
        try {
          const { data: menusData, error } = await supabase
            .from("menus")
            .select("id, name")
            .eq("restaurant_id", atob(suffix!))
            .eq("id", atob(menuSuffix!));

          if (error) return error;

          const dishes = await Promise.all(
            menusData.map(async (menu) => {
              const { data: dishData, error: dishError } = await supabase
                .from("dishes")
                .select(
                  "id, name, description, price, images, video, video_thumbnail"
                )
                .eq("menu_id", menu.id);

              if (dishError) {
                throw dishError;
              }

              return {
                ...menu,
                dishes: dishData,
              };
            })
          );

          setMenuData(dishes);
        } catch (error) {
          console.error("Error fetching dishes data:", error);
        } finally {
          setIsDishesLoading(false);
        }
      }
    };

    fetchDishes();
  }, []);

  return (
    <>
      {menuData ? (
        <LayoutWithoutFooter>
          <section className="select-none">
            <div className="reelsContainer scrollbar-hidden animated-fade">
              {menuData.map((item: any) =>
                item.dishes.length > 0 ? (
                  <div key={"mobile-menu-" + item.id} className="reel">
                    {isDishesLoading ? (
                      <div className="reelsContainer scrollbar-hidden h-full w-full">
                        <MenuDish classes="reel" />
                      </div>
                    ) : (
                      <div className="reelsContainer scrollbar-hidden h-full w-full">
                        {item.dishes.map((data: any) => (
                          <div
                            key={"mobile-dish-" + data.id}
                            className={`reel relative w-full ${
                              data ? "animated-fade" : ""
                            }`}
                          >
                            {data.video ? (
                              <VideoPlayer
                                src={data.video}
                                poster={data.video_thumbnail}
                                classes={
                                  "h-full w-full rounded-xl object-cover"
                                }
                              />
                            ) : (
                              <Swiper
                                modules={[Autoplay, EffectFade]}
                                slidesPerView={1}
                                loop={true}
                                autoplay={true}
                                effect="fade"
                                className="h-screen w-full"
                              >
                                {data.images.map((data: any) => (
                                  <div key={"mobile-image-" + data}>
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
                              <p>{data.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </section>
        </LayoutWithoutFooter>
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
