"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import supabase from "@/utils/supabase";
import SectionTitle from "@/components/Common/SectionTitle";

import "swiper/css";
import "swiper/css/effect-fade";
import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import NoDataFound from "@/components/NoDataFound";

const CuisineRestaurant = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);
  const [restaurants, setRestaurantsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const { data, error } = await supabase
            .from("restaurants")
            .select("*")
            .contains("tags", [(id as string)?.replace(/-/g, " ")]);

          if (error) throw error;

          setRestaurantsData(data);
          setIsRestaurantsLoading(false);
        }
      } catch (error) {
        console.error("Error while fetching cuisine restaurants: ", error);
        setIsRestaurantsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <RootLayout>
        <section className="py-16 md:py-20 lg:py-28">
          <div className="container">
            <SectionTitle
              title={(id as string)?.replace(/-/g, " ")}
              paragraph="From trending dishes to hidden gems, this personalized recommendation feature ensures that your next food adventure is always exciting and tailored to your unique taste buds."
              customClass="mb-28 mt-20 capitalize animated-fade-y"
            />

            {isRestaurantsLoading ? (
              <div className="grid h-80 grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:h-60 xl:grid-cols-2">
                <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
                <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
                <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 lg:block"></div>
                <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 lg:block"></div>
              </div>
            ) : restaurants.length > 0 ? (
              <div className="animated-fade-y grid grid-cols-1 gap-4 xs:gap-10 lg:grid-cols-2">
                {restaurants.map((item) => (
                  <Link
                    href={`/restaurants/${item.id}`}
                    key={"may-like-" + item.id}
                    className="relative h-full cursor-pointer"
                  >
                    <Swiper
                      modules={[Autoplay, EffectFade]}
                      slidesPerView={1}
                      loop={true}
                      autoplay={true}
                      effect="fade"
                      className="sm:h-[25rem]"
                    >
                      {item.images.map((data: any) => (
                        <div key={"image-" + data}>
                          <SwiperSlide>
                            <Image
                              src={data}
                              fill
                              className="h-full w-full object-cover"
                              alt="item-image"
                            />
                          </SwiperSlide>
                        </div>
                      ))}
                    </Swiper>
                    <div className="absolute top-0 z-[1] h-full w-full bg-gradient-to-t from-black/70 to-transparent md:via-transparent">
                      <div className="absolute bottom-2 z-[1] w-full px-3 text-white sm:bottom-5 sm:px-8">
                        <p className="mb-2 border-b border-white border-opacity-30 pb-2 text-xl font-extrabold sm:text-2xl">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-200 sm:text-base">
                          {item.address}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <NoDataFound text="😕 Oops, No restaurants available at the moment!" />
            )}
          </div>
        </section>
      </RootLayout>
    </>
  );
};

export default CuisineRestaurant;
