"use client";

import Image from "next/image";
import foodData from "@/components/FoodCategory/foodData";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

const PopularFood = () => {
  return (
    <>
      <div className="container flex flex-col gap-5">
        <p className="text-3xl font-extrabold">Popular Food</p>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={6}
          loop={true}
          autoplay={true}
          className="!hidden h-[20rem] w-full xl:!block"
        >
          {foodData.map((item) => (
            <div key={"search-" + item.id}>
              <SwiperSlide>
                <div className="flex h-[15rem] w-[12rem] cursor-pointer flex-col gap-2">
                  <Image
                    src={item.image}
                    width={250}
                    height={250}
                    className="h-[12rem] rounded-2xl object-cover"
                    alt="item-image"
                  />
                  <p className="text-center text-lg font-black">{item.name}</p>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={5}
          loop={true}
          autoplay={true}
          className="!hidden h-[20rem] w-full lg:!block xl:!hidden"
        >
          {foodData.map((item) => (
            <div key={"search-" + item.id}>
              <SwiperSlide>
                <div className="flex  h-[15rem] w-[10rem] cursor-pointer flex-col gap-2">
                  <Image
                    src={item.image}
                    width={250}
                    height={250}
                    className="h-[10rem] rounded-2xl object-cover"
                    alt="item-image"
                  />
                  <p className="text-center text-lg font-black">{item.name}</p>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={4}
          loop={true}
          autoplay={true}
          className="!hidden h-[20rem] w-full md:!block lg:!hidden"
        >
          {foodData.map((item) => (
            <div key={"search-" + item.id}>
              <SwiperSlide>
                <div className="flex  h-[15rem] w-[10rem] cursor-pointer flex-col gap-2">
                  <Image
                    src={item.image}
                    width={250}
                    height={250}
                    className="h-[10rem] rounded-2xl object-cover"
                    alt="item-image"
                  />
                  <p className="text-center text-lg font-black">{item.name}</p>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          loop={true}
          autoplay={true}
          className="!hidden h-[20rem] w-full sm:!block md:!hidden"
        >
          {foodData.map((item) => (
            <div key={"search-" + item.id}>
              <SwiperSlide>
                <div className="flex h-[15rem] w-[10rem] cursor-pointer flex-col gap-2">
                  <Image
                    src={item.image}
                    width={250}
                    height={250}
                    className="h-[10rem] rounded-2xl object-cover"
                    alt="item-image"
                  />
                  <p className="text-center text-lg font-black">{item.name}</p>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={true}
          className="h-[25rem] w-full sm:!hidden"
        >
          {foodData.map((item) => (
            <div key={"search-" + item.id}>
              <SwiperSlide>
                <div className="flex h-[20rem] w-full cursor-pointer flex-col gap-2">
                  <Image
                    src={item.image}
                    width={250}
                    height={250}
                    className="h-[16rem] w-full rounded-2xl object-cover"
                    alt="item-image"
                  />
                  <p className="text-center text-lg font-black">{item.name}</p>
                </div>
              </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default PopularFood;
