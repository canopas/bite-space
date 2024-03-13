"use client";

import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import SectionTitle from "../Common/SectionTitle";
import supabase from "@/utils/supabase";

import "swiper/css";
import "swiper/css/effect-fade";

const YouMayLike = () => {
  const [restaurants, setRestaurantsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("restaurants").select();
      if (error) throw error;

      data.map((item) => {
        item.rating = 4.3;
        item.reviews = 150;
      });

      setRestaurantsData(data);
    };

    fetchData();
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const animateRestaurantsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = animateRestaurantsRef.current;

      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Check if the element is within the viewport
        if (elementTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

          <div
            className="grid grid-cols-1 gap-4 xs:gap-10 lg:grid-cols-2"
            ref={animateRestaurantsRef}
          >
            {restaurants.map((item) => (
              <Link
                href={`/restaurants/${item.id}/menu`}
                key={"may-like-" + item.id}
                className={`animated-fade-y-on-scroll relative h-full cursor-pointer ${
                  isVisible ? "animate" : ""
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default YouMayLike;
