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
import { getFoodCategories } from "@/store/category/slice";

const FoodCategory = ({ categories }: { categories: any }) => {
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.home.categories);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(
    categories ? false : true
  );
  const [categoriesData, setCategoriesData] = useState<any | null>(categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getFoodCategories();
        if (error) throw error;

        dispatch(setCategoriesState(data));
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    if (!categories) {
      if (categoriesState.length == 0) {
        fetchCategories();
      } else {
        setCategoriesData(categoriesState);
        setIsCategoriesLoading(false);
      }
    }
  }, [dispatch, categories, categoriesState, categoriesState.length]);

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container animated-fade">
          <SectionTitle
            title="What's on your mind?"
            paragraph="We believe in the power of expression – so go ahead, let your thoughts flow."
            customClass="mx-auto text-center mb-12 xl:mb-28 mt-20"
          />

          {isCategoriesLoading ? (
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
                {categoriesData.map((item: any, index: any) => (
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
                {categoriesData.map((item: any, index: any) => (
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
                {categoriesData.map((item: any, index: any) => (
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
                {categoriesData.map((item: any, index: any) => (
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
