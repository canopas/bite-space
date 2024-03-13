"use client";

import supabase from "@/utils/supabase";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "styles/reels.css";

const Menu = ({ paramsData }: { paramsData: { restaurant: string } }) => {
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuData, setAnimatedElements] = useState([]);
  const animateMenuItemRef = useRef([]);

  const handleScroll = () => {
    animateMenuItemRef.current.forEach((ref, index) => {
      if (ref) {
        const elementTop = ref.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Check if the element is within the viewport
        if (elementTop < windowHeight * 0.75) {
          setAnimatedElements((prevElements) =>
            prevElements.map((element, i) =>
              i === index ? { ...element, isVisible: true } : element
            )
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", paramsData.restaurant)
          .single();

        if (error) {
          throw error;
        }

        setRestaurantData(data);
        setIsRestaurantLoading(false);
        fetchDishes();
      } catch (error) {
        console.error("Error fetching restaurant data:", error.message);
      }
    };

    const fetchDishes = async () => {
      const { data: menusData } = await supabase
        .from("menus")
        .select("id, name")
        .eq("restaurant_id", paramsData.restaurant);

      const dishes = await Promise.all(
        menusData.map(async (menu) => {
          const { data: dishData, error: dishError } = await supabase
            .from("dishes")
            .select("id, name, description, price, images, video")
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

      setAnimatedElements(dishes);
    };

    fetchRestaurantData();
    fetchDishes();

    window.addEventListener("scroll", handleScroll);

    setAnimatedElements((prevElements) =>
      prevElements.map(() => ({ isVisible: true }))
    );

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [paramsData.restaurant]);

  return (
    <>
      <section className="hidden pb-28 sm:block">
        {restaurantData ? (
          <div>
            <div className="relative mx-auto mb-16 capitalize">
              <div className="animated-fade-y h-[50rem] w-full">
                {restaurantData.images ? (
                  <Image
                    src={restaurantData.images[0]}
                    height={100}
                    width={100}
                    alt="restaurant-cover-image"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="animated-fade-y absolute top-0 h-full w-full bg-black bg-opacity-60">
                <div className="container h-full w-full">
                  <div className="animated-fade-y absolute bottom-0 pb-20">
                    <div className="text-3xl font-bold text-white sm:text-4xl md:text-[50px]">
                      {restaurantData.name}
                    </div>
                    <p className="mt-4 text-base !leading-relaxed text-white md:text-lg">
                      {restaurantData.description}
                    </p>
                    <div className="mt-10 flex w-full flex-col gap-5 text-xs text-white sm:text-base lg:flex-row">
                      <div className="flex items-center gap-2 lg:border-r lg:pr-5">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path d="M12 2C7.745 2 4.27 5.475 4.27 9.73c0 4.539 4.539 9.056 6.971 11.486L12 22l.759-.761c2.433-2.453 6.972-6.97 6.972-11.509C19.73 5.475 16.256 2 12 2zm0 10.986c-1.93 0-3.5-1.569-3.5-3.5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.931-1.57 3.5-3.5 3.5z"></path>
                        </svg>
                        <p>{restaurantData.address}</p>
                      </div>
                      <div className="flex items-center gap-2 lg:border-r lg:pr-5">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.525 2.011l5.173 5.176-1.826 2.725.096.207c.167.348.427.829.8 1.347.707.986 1.796 2.082 3.383 2.7l3.168-1.354 4.671 4.674-3.152 4.2-.32.038-.087-.745.086.745h-.004l-.006.001-.018.002a5.117 5.117 0 01-.265.017c-.175.007-.424.01-.737-.004a12.514 12.514 0 01-2.557-.399c-2.109-.547-4.89-1.794-7.668-4.574-2.781-2.783-4.037-5.574-4.591-7.69a12.69 12.69 0 01-.409-2.568 8.769 8.769 0 01.003-.946l.005-.06.002-.018V5.48l.001-.002s0-.002.746.08l-.746-.082.036-.325 4.216-3.139zM3.751 5.947c-.002.127 0 .29.01.487.026.538.114 1.318.361 2.262.493 1.884 1.625 4.433 4.2 7.01 2.573 2.575 5.111 3.698 6.984 4.184.94.243 1.716.327 2.25.351.196.01.359.01.485.008l1.969-2.623-3.035-3.036-2.773 1.185-.272-.093c-2.115-.726-3.517-2.137-4.381-3.341a10.51 10.51 0 01-.934-1.574 8.35 8.35 0 01-.29-.682l-.004-.012-.002-.005v-.001s0-.002.71-.242l-.71.24-.12-.35 1.567-2.339L6.38 3.99 3.75 5.947z"
                          ></path>
                        </svg>
                        <p>{restaurantData.phone}</p>
                      </div>
                      <div className="flex items-center gap-2 lg:pr-5">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22.507 17.952c0-.416-.369-.605-.45-.643a1.432 1.432 0 00-.338-.105 4.647 4.647 0 00-.595-.064c-.403-.022-.88-.022-1.195-.022H4.267c-.776 0-1.293.01-1.621.04-.152.015-.34.04-.507.103a.912.912 0 00-.338.217.683.683 0 00-.196.473v.667h20.902v-.666zM18.287 5.893H5.809v8.447h12.478V5.893zm-13.978-1.5V15.84h15.478V4.393H4.309z"
                          ></path>
                        </svg>
                        <p>Website</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              {menuData.map((item, index) =>
                item.dishes.length > 0 ? (
                  <div
                    key={"desktop-menu-" + item.id}
                    id={"desktop-menu-" + item.id}
                    className={`animated-fade-y-on-scroll w-full ${
                      item.isVisible ? "animate" : ""
                    }`}
                    ref={(el) => (animateMenuItemRef.current[index] = el)}
                  >
                    <div className="mt-20 flex w-full flex-col gap-5">
                      <p className="border-b border-black/10 pb-2 text-3xl font-bold dark:border-white/30">
                        {item.name}
                      </p>
                      <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {item.dishes.map((data: any) => (
                          <div
                            key={"desktop-dish-" + data.id}
                            id={"desktop-dish-" + data.id}
                            className="animated-fade-y relative w-full"
                          >
                            {data.video ? (
                              <video
                                loop
                                autoPlay
                                muted
                                playsInline
                                webkit-playsinline
                                className="h-[30rem] w-full rounded-xl object-cover"
                              >
                                <source src={data.video} type="video/mp4" />
                              </video>
                            ) : (
                              <Swiper
                                modules={[Autoplay, EffectFade]}
                                slidesPerView={1}
                                loop={true}
                                autoplay={true}
                                effect="fade"
                                className="h-[30rem] w-full rounded-xl"
                              >
                                {data.images.map((data: any) => (
                                  <div
                                    key={"desktop-image-" + data}
                                    id={"image-" + data}
                                  >
                                    <SwiperSlide>
                                      <Image
                                        src={data}
                                        height={100}
                                        width={100}
                                        alt="menu-dish-image"
                                        className="h-full w-full object-cover"
                                      />
                                    </SwiperSlide>
                                  </div>
                                ))}
                              </Swiper>
                            )}
                            <div className="absolute top-0 z-[1] h-full w-full rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent">
                              <div className="absolute bottom-0 flex flex-col gap-2 px-4 pb-4">
                                <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-1 text-xl font-bold">
                                  <p className="min-w-2/5 text-white">
                                    {data.name}
                                  </p>
                                  <p className="text-lg text-white/70">
                                    ₹{data.price}
                                  </p>
                                </div>
                                <p className="text-sm text-white/90">
                                  {data.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center text-black/50 dark:text-white/70">
            {isRestaurantLoading ? "Loading..." : "No Data Found"}
          </div>
        )}
      </section>
      <section className="sm:hidden">
        {restaurantData ? (
          <div className="scrollbar-hidden reelsContainer">
            <div className="reel relative capitalize">
              <div className="h-full w-full">
                <Image
                  src="/images/restaurants/1-1.webp"
                  height={100}
                  width={100}
                  alt="restaurant-cover-image"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute top-0 h-full w-full bg-black bg-opacity-60">
                <div className="h-full w-full">
                  <div className="absolute bottom-0 px-5 pb-5">
                    <div className="text-3xl font-bold text-white">
                      Spice Villa
                    </div>
                    <p className="mt-4 border-b border-white/10 pb-5 text-base text-white">
                      We believe in the power of expression – so go ahead, let
                      your thoughts flow.
                    </p>
                    <div className="mt-10 flex w-full flex-col gap-5 text-xs text-white">
                      <div className="flex items-center gap-2">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path d="M12 2C7.745 2 4.27 5.475 4.27 9.73c0 4.539 4.539 9.056 6.971 11.486L12 22l.759-.761c2.433-2.453 6.972-6.97 6.972-11.509C19.73 5.475 16.256 2 12 2zm0 10.986c-1.93 0-3.5-1.569-3.5-3.5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.931-1.57 3.5-3.5 3.5z"></path>
                        </svg>
                        <p>
                          Dumas Road, Piplod Behind Iscon Mall, Surat - 395007,
                          India
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.525 2.011l5.173 5.176-1.826 2.725.096.207c.167.348.427.829.8 1.347.707.986 1.796 2.082 3.383 2.7l3.168-1.354 4.671 4.674-3.152 4.2-.32.038-.087-.745.086.745h-.004l-.006.001-.018.002a5.117 5.117 0 01-.265.017c-.175.007-.424.01-.737-.004a12.514 12.514 0 01-2.557-.399c-2.109-.547-4.89-1.794-7.668-4.574-2.781-2.783-4.037-5.574-4.591-7.69a12.69 12.69 0 01-.409-2.568 8.769 8.769 0 01.003-.946l.005-.06.002-.018V5.48l.001-.002s0-.002.746.08l-.746-.082.036-.325 4.216-3.139zM3.751 5.947c-.002.127 0 .29.01.487.026.538.114 1.318.361 2.262.493 1.884 1.625 4.433 4.2 7.01 2.573 2.575 5.111 3.698 6.984 4.184.94.243 1.716.327 2.25.351.196.01.359.01.485.008l1.969-2.623-3.035-3.036-2.773 1.185-.272-.093c-2.115-.726-3.517-2.137-4.381-3.341a10.51 10.51 0 01-.934-1.574 8.35 8.35 0 01-.29-.682l-.004-.012-.002-.005v-.001s0-.002.71-.242l-.71.24-.12-.35 1.567-2.339L6.38 3.99 3.75 5.947z"
                          ></path>
                        </svg>
                        <p>+91 1236547890</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="fill-current text-primary"
                          viewBox="0 0 24 24"
                          width="20px"
                          height="20px"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22.507 17.952c0-.416-.369-.605-.45-.643a1.432 1.432 0 00-.338-.105 4.647 4.647 0 00-.595-.064c-.403-.022-.88-.022-1.195-.022H4.267c-.776 0-1.293.01-1.621.04-.152.015-.34.04-.507.103a.912.912 0 00-.338.217.683.683 0 00-.196.473v.667h20.902v-.666zM18.287 5.893H5.809v8.447h12.478V5.893zm-13.978-1.5V15.84h15.478V4.393H4.309z"
                          ></path>
                        </svg>
                        <p>Website</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="reel scrollbar-hidden">
              <div className="reelsContainer scrollbar-hidden">
                {menuData.map((item) => (
                  <div key={"mobile-menu-" + item.id} className="reel">
                    <div className="reelsContainer scrollbar-hidden h-full w-full">
                      {item.dishes.map((data) => (
                        <div
                          key={"mobile-dish-" + data.id}
                          className="reel relative w-full"
                        >
                          {data.video ? (
                            <video
                              loop
                              autoPlay
                              muted
                              playsInline
                              webkit-playsinline
                              className="h-full w-full rounded-xl object-cover"
                            >
                              <source src={data.video} type="video/mp4" />
                            </video>
                          ) : (
                            <Swiper
                              modules={[Autoplay, EffectFade]}
                              slidesPerView={1}
                              loop={true}
                              autoplay={true}
                              effect="fade"
                              className="h-screen w-full"
                            >
                              {data.images.map((data) => (
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
                            <p className="">{data.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-screen w-full items-center justify-center text-black/50 dark:text-white/70">
            {isRestaurantLoading ? "Loading..." : "No Data Found"}
          </div>
        )}
      </section>
    </>
  );
};

export default Menu;
