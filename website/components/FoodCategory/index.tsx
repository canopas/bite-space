"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import supabase from "@/utils/supabase";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import SectionTitle from "../Common/SectionTitle";

import "swiper/css";
import "swiper/css/navigation";

const FoodCategory = () => {
  const [error, setError] = useState<any | null>(null);
  const [foodData, setFoodData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select()
          .eq("restaurant_id", 0);

        if (error) throw error;

        setFoodData(data);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <section className="bg-primary/[.03] py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="What's on your mind?"
            paragraph="We believe in the power of expression – so go ahead, let your thoughts flow."
            customClass="mx-auto text-center mb-28 mt-20"
          />

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={4}
            loop={true}
            autoplay={true}
            navigation
            className="food-category-swiper !hidden h-[27rem] lg:!block"
          >
            {foodData.map((item) => (
              <div key={"food-category-" + item.id}>
                <SwiperSlide>
                  <Link
                    href={`/category/${item.id}`}
                    className="flex h-80 w-[15rem] cursor-pointer flex-col gap-2"
                  >
                    <Image
                      src={item.image}
                      height={100}
                      width={300}
                      className="h-[16rem] rounded-2xl object-cover"
                      alt="item-image"
                    />
                    <p className="text-center text-lg font-black">
                      {item.name}
                    </p>
                  </Link>
                </SwiperSlide>
              </div>
            ))}
          </Swiper>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={3}
            loop={true}
            autoplay={true}
            navigation
            className="food-category-swiper !hidden h-[27rem] md:!block lg:!hidden"
          >
            {foodData.map((item) => (
              <div key={"food-category-" + item.id}>
                <SwiperSlide>
                  <Link
                    href={`/category/${item.id}`}
                    className="flex h-80 w-[15rem] cursor-pointer flex-col gap-2"
                  >
                    <Image
                      src={item.image}
                      height={100}
                      width={100}
                      className="h-[16rem] w-full rounded-2xl object-cover"
                      alt="item-image"
                    />
                    <p className="text-center text-lg font-black">
                      {item.name}
                    </p>
                  </Link>
                </SwiperSlide>
              </div>
            ))}
          </Swiper>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={2}
            loop={true}
            autoplay={true}
            navigation
            className="food-category-swiper !hidden h-[27rem] sm:!block md:!hidden"
          >
            {foodData.map((item) => (
              <div key={"food-category-" + item.id}>
                <SwiperSlide>
                  <Link
                    href={`/category/${item.id}`}
                    className="flex h-72 w-64 cursor-pointer flex-col"
                  >
                    <Image
                      src={item.image}
                      height={100}
                      width={100}
                      className="h-[16rem] w-full rounded-2xl object-cover"
                      alt="item-image"
                    />
                    <p className="text-center text-lg font-black">
                      {item.name}
                    </p>
                  </Link>
                </SwiperSlide>
              </div>
            ))}
          </Swiper>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={true}
            navigation
            className="food-category-swiper h-[27rem] sm:!hidden"
          >
            {foodData.map((item) => (
              <div key={"food-category-" + item.id}>
                <SwiperSlide>
                  <Link
                    href={`/category/${item.id}`}
                    className="flex h-80 w-full cursor-pointer flex-col gap-2"
                  >
                    <Image
                      src={item.image}
                      height={100}
                      width={100}
                      className="h-[16rem] w-full rounded-2xl object-cover"
                      alt="item-image"
                    />
                    <p className="text-center text-lg font-black">
                      {item.name}
                    </p>
                  </Link>
                </SwiperSlide>
              </div>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default FoodCategory;
