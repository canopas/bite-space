"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import SectionTitle from "../Common/SectionTitle";
import supabase from "@/utils/supabase";

import "swiper/css";
import "swiper/css/effect-fade";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setRestaurantsState } from "@/store/home/slice";
import { getYouMayLikeData } from "@/store/category/slice";

const YouMayLike = ({ restaurants }: { restaurants: any }) => {
  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const restaurantsState = useAppSelector((state) => state.home.restaurants);
  const [restaurantsData, setRestaurantsData] = useState<any | null>(
    restaurants
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await getYouMayLikeData();
        if (error) return error;

        dispatch(setRestaurantsState(data));
        setRestaurantsData(data);
      } catch (error) {
        console.error("Error while fetching restaurants data: ", error);
      }
    };

    if (!restaurants) {
      if (restaurantsState.length == 0) {
        fetchData();
      } else {
        setRestaurantsData(restaurantsState);
      }
    }
  }, [dispatch, restaurants, restaurantsState, restaurantsState.length]);

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container animated-fade">
          <SectionTitle
            title="You May Like This"
            paragraph="From trending dishes to hidden gems, this personalized recommendation feature ensures that your next food adventure is always exciting and tailored to your unique taste buds."
            customClass="mb-12 xl:mb-28 mt-20"
          />

          {restaurantsData ? (
            <div
              className={`grid grid-cols-1 gap-4 xs:gap-10 lg:grid-cols-2 ${
                !isPageReset ? "animated-fade-y" : ""
              }`}
            >
              {restaurantsData.map((item: any, index: any) => (
                <Link
                  key={"may-like-" + index}
                  href={
                    "/restaurants/" +
                    encodeURIComponent(
                      item.name.toLowerCase().replace(/\s+/g, "-")
                    ) +
                    "-" +
                    btoa(item.id.toString())
                  }
                  className="relative h-full cursor-pointer"
                  aria-label={`View details about ${item.name}`}
                >
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    slidesPerView={1}
                    loop={true}
                    autoplay={true}
                    effect="fade"
                    className="sm:h-[25rem]"
                  >
                    {item.images.map((data: any, index: any) => (
                      <SwiperSlide key={"restaurant-image-swiper-" + index}>
                        <Image
                          src={data}
                          height={100}
                          width={100}
                          className="h-full w-full object-cover"
                          alt={`Image of ${item.name}`}
                          loading="lazy"
                        />
                      </SwiperSlide>
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
            ""
          )}
        </div>
      </section>
    </>
  );
};

export default YouMayLike;
