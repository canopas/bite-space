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
import CategorySwiperSkeleton from "../SkeletonPlaceholders/CategorySwiper";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCategoriesState } from "@/store/home/slice";

const FoodCategory = () => {
  const dispatch = useAppDispatch();
  const foodDataState = useAppSelector((state) => state.home.categories);

  const [isFoodLoading, setIsFoodLoading] = useState(true);
  const [foodData, setFoodData] = useState<any | null>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", 0)
          .order("id", { ascending: true });

        if (error) throw error;

        dispatch(setCategoriesState(data));
        setFoodData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsFoodLoading(false);
      }
    };

    if (foodDataState.length == 0) {
      fetchCategories();
    } else {
      setFoodData(foodDataState);
      setIsFoodLoading(false);
    }
  }, [dispatch, foodDataState, foodDataState.length]);

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="What's on your mind?"
            paragraph="We believe in the power of expression – so go ahead, let your thoughts flow."
            customClass="mx-auto text-center mb-12 xl:mb-28 mt-20"
          />

          {isFoodLoading ? (
            <CategorySwiperSkeleton />
          ) : (
            <>
              <Swiper
                modules={[Navigation, Autoplay]}
                slidesPerView={4}
                loop={true}
                autoplay={true}
                navigation
                className="food-category-swiper !hidden h-[27rem] lg:!block"
              >
                {foodData.map((item: any, index: any) => (
                  <SwiperSlide key={"lg-category-index-" + index}>
                    <Link
                      href={
                        "/category/" +
                        encodeURIComponent(
                          item.name.toLowerCase().replace(/\s+/g, "-")
                        ) +
                        "-" +
                        btoa(item.id.toString())
                      }
                      className="flex h-80 w-full cursor-pointer flex-col gap-2 items-center"
                    >
                      <Image
                        src={item.image}
                        height={100}
                        width={300}
                        className="h-[16rem] w-[15rem] rounded-2xl object-cover"
                        alt="item-image"
                      />
                      <p className="text-center text-lg font-black">
                        {item.name}
                      </p>
                    </Link>
                  </SwiperSlide>
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
                {foodData.map((item: any, index: any) => (
                  <SwiperSlide key={"md-category-index-" + index}>
                    <Link
                      href={
                        "/category/" +
                        encodeURIComponent(
                          item.name.toLowerCase().replace(/\s+/g, "-")
                        ) +
                        "-" +
                        btoa(item.id.toString())
                      }
                      className="flex h-80 w-full cursor-pointer flex-col gap-2 items-center"
                    >
                      <Image
                        src={item.image}
                        height={100}
                        width={100}
                        className="h-[16rem] w-[15rem] rounded-2xl object-cover"
                        alt="item-image"
                      />
                      <p className="text-center text-lg font-black">
                        {item.name}
                      </p>
                    </Link>
                  </SwiperSlide>
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
                {foodData.map((item: any, index: any) => (
                  <SwiperSlide key={"sm-category-index-" + index}>
                    <Link
                      href={
                        "/category/" +
                        encodeURIComponent(
                          item.name.toLowerCase().replace(/\s+/g, "-")
                        ) +
                        "-" +
                        btoa(item.id.toString())
                      }
                      className="flex h-72 w-full cursor-pointer flex-col items-center"
                    >
                      <Image
                        src={item.image}
                        height={100}
                        width={100}
                        className="h-[16rem] w-64 rounded-2xl object-cover"
                        alt="item-image"
                      />
                      <p className="text-center text-lg font-black">
                        {item.name}
                      </p>
                    </Link>
                  </SwiperSlide>
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
                {foodData.map((item: any, index: any) => (
                  <SwiperSlide key={"xs-category-index-" + index}>
                    <Link
                      href={
                        "/category/" +
                        encodeURIComponent(
                          item.name.toLowerCase().replace(/\s+/g, "-")
                        ) +
                        "-" +
                        btoa(item.id.toString())
                      }
                      className="flex items-center h-80 w-full cursor-pointer flex-col"
                    >
                      <Image
                        src={item.image}
                        height={100}
                        width={100}
                        className="h-72 w-80 rounded-2xl object-cover"
                        alt="item-image"
                      />
                      <p className="text-center text-lg font-black">
                        {item.name}
                      </p>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default FoodCategory;
