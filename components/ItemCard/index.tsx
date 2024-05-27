"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import SectionTitle from "../Common/SectionTitle";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setFoodItemsState } from "@/store/home/slice";
import { getItemCardData } from "@/store/category/slice";

import "swiper/css";
import "swiper/css/navigation";
import VideoPlayer from "../VideoPlayer";

const ItemCard = ({ items }: { items: any }) => {
  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const itemsState = useAppSelector((state) => state.home.foodItems);

  const [itemsData, setMostBrowsedItemData] = useState<any | null>(items);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await getItemCardData();
        if (error) return error;

        dispatch(setFoodItemsState(data));
        setMostBrowsedItemData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!items) {
      if (itemsState.length == 0) {
        fetchData();
      } else {
        setMostBrowsedItemData(itemsState);
      }
    }
  }, [dispatch, items, itemsState, itemsState.length]);

  return (
    <section className="bg-primary bg-opacity-10 py-16 md:py-20 lg:py-28">
      <div className="container animated-fade">
        <SectionTitle
          title="Culinary Delights: A Diverse Food List"
          paragraph="Indulge in a world of flavors with our curated food list, featuring a range of delectable items to satisfy every palate."
          customClass="mb-12 xl:mb-28"
        />
        {itemsData ? (
          <>
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={3}
              loop={true}
              autoplay={true}
              navigation
              className="food-category-swiper !hidden h-[40rem] lg:!block"
            >
              {itemsData.map((item: any, index: any) => (
                <SwiperSlide key={"lg-category-index-" + index}>
                  <Link
                    href={
                      "/restaurants/" +
                      encodeURIComponent(
                        item.menus.restaurants.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      ) +
                      "-" +
                      btoa(item.menus.restaurants.id.toString())
                    }
                    className="flex h-full w-full cursor-pointer flex-col gap-2 items-center"
                  >
                    {item.video && item.video_thumbnail ? (
                      <VideoPlayer
                        src={item.video}
                        poster={item.video_thumbnail}
                        classes={
                          "h-[20rem] xl:h-[22rem] w-[20rem] xl:w-[25rem] rounded-2xl object-cover"
                        }
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt="item-image"
                        className="h-[20rem] xl:h-[22rem] w-[20rem] xl:w-[25rem] rounded-2xl object-cover"
                        height={100}
                        width={300}
                        loading="lazy"
                      />
                    )}
                    <div className="w-[18rem] xl:w-[23rem] mt-5">
                      <div className="mb-3 flex justify-between text-lg font-bold">
                        <p>{item.name}</p>
                        <p className="opacity-50">₹{item.price}</p>
                      </div>
                      {item.description ? (
                        <p className="text-center border-t border-black dark:border-white border-opacity-10 dark:border-opacity-20 text-xs pt-3">
                          {item.description}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
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
              className="food-category-swiper !hidden h-[36rem] md:!block lg:!hidden"
            >
              {itemsData.map((item: any, index: any) => (
                <SwiperSlide key={"lg-category-index-" + index}>
                  <Link
                    href={
                      "/restaurants/" +
                      encodeURIComponent(
                        item.menus.restaurants.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      ) +
                      "-" +
                      btoa(item.menus.restaurants.id.toString())
                    }
                    className="flex h-full w-full cursor-pointer flex-col gap-2 items-center"
                  >
                    {item.video && item.video_thumbnail ? (
                      <VideoPlayer
                        src={item.video}
                        poster={item.video_thumbnail}
                        classes={"h-[20rem] w-[20rem] rounded-2xl object-cover"}
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt="item-image"
                        className="h-[20rem] w-[20rem] rounded-2xl object-cover"
                        height={100}
                        width={300}
                        loading="lazy"
                      />
                    )}
                    <div className="w-[18rem] mt-5">
                      <div className="mb-3 flex justify-between text-lg font-bold">
                        <p>{item.name}</p>
                        <p className="opacity-50">₹{item.price}</p>
                      </div>
                      {item.description ? (
                        <p className="text-center border-t border-black dark:border-white border-opacity-10 dark:border-opacity-20 text-xs pt-3">
                          {item.description}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
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
              className="food-category-swiper md:!hidden h-[36rem]"
            >
              {itemsData.map((item: any, index: any) => (
                <SwiperSlide key={"lg-category-index-" + index}>
                  <Link
                    href={
                      "/restaurants/" +
                      encodeURIComponent(
                        item.menus.restaurants.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      ) +
                      "-" +
                      btoa(item.menus.restaurants.id.toString())
                    }
                    className="flex h-full w-full cursor-pointer flex-col gap-2 items-center"
                  >
                    {item.video && item.video_thumbnail ? (
                      <VideoPlayer
                        src={item.video}
                        poster={item.video_thumbnail}
                        classes={
                          "h-[20rem] w-[20rem] sm:w-[25rem] rounded-2xl object-cover"
                        }
                      />
                    ) : (
                      <Image
                        src={item.image}
                        alt="item-image"
                        className="h-[20rem] w-[20rem] sm:w-[25rem] rounded-2xl object-cover"
                        height={100}
                        width={300}
                        loading="lazy"
                      />
                    )}
                    <div className="w-[18rem] sm:w-[23rem] mt-5">
                      <div className="mb-3 flex justify-between text-lg font-bold">
                        <p>{item.name}</p>
                        <p>₹{item.price}</p>
                      </div>
                      {item.description ? (
                        <p className="text-center border-t border-black dark:border-white border-opacity-10 dark:border-opacity-20 text-xs pt-3">
                          {item.description}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <div className="grid h-80 grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:h-60 xl:grid-cols-3">
            <div className="animate-pulse rounded-xl bg-black/10 dark:bg-white/10"></div>
            <div className="animate-pulse rounded-xl bg-black/10 dark:bg-white/10"></div>
            <div className="animate-pulse rounded-xl bg-black/10 dark:bg-white/10"></div>
            <div className="hidden animate-pulse rounded-xl bg-black/10 dark:bg-white/10 md:block"></div>
            <div className="hidden animate-pulse rounded-xl bg-black/10 dark:bg-white/10 md:block"></div>
            <div className="hidden animate-pulse rounded-xl bg-black/10 dark:bg-white/10 md:block"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItemCard;
