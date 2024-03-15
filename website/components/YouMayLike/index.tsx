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
import { InView } from "react-intersection-observer";

const YouMayLike = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurantsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("restaurants").select();
        if (error) throw error;

        data.map((item) => {
          item.rating = 4.3;
          item.reviews = 150;
        });

        setRestaurantsData(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="You May Like This"
            paragraph="From trending dishes to hidden gems, this personalized recommendation feature ensures that your next food adventure is always exciting and tailored to your unique taste buds."
            customClass="mb-28 mt-20"
          />

          {isLoading ? (
            <section>
              <div className="py-20 text-center text-black/40 dark:text-white/70">
                Loading...
              </div>
            </section>
          ) : (
            <div className="grid grid-cols-1 gap-4 xs:gap-10 lg:grid-cols-2">
              {restaurants.map((item) => (
                <div key={"may-like-" + item.id}>
                  <InView triggerOnce>
                    {({ inView, ref, entry }) => (
                      <Link
                        ref={ref}
                        href={`/restaurants/${item.id}/menu`}
                        className={`relative h-full cursor-pointer ${
                          inView ? "animated-fade-y" : ""
                        }`}
                      >
                        <Swiper
                          modules={[Autoplay, EffectFade]}
                          slidesPerView={1}
                          loop={true}
                          autoplay={true}
                          effect="fade"
                          className="sm:h-[25rem]"
                        >
                          {item.images.map((data) => (
                            <div key={"image-" + data}>
                              <SwiperSlide>
                                <Image
                                  src={data}
                                  height={100}
                                  width={100}
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
                            <div className="flex items-center justify-between font-extrabold">
                              <p className="">
                                {item.reviews}{" "}
                                <span className="text-sm font-normal text-gray-200">
                                  {" "}
                                  Reviews
                                </span>
                              </p>
                              <p className="rounded-full px-4 sm:py-2">
                                ⭐ {item.rating}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </InView>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default YouMayLike;
