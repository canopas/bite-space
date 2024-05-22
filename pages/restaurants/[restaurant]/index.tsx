"use client";

import supabase from "@/utils/supabase";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

import { InView } from "react-intersection-observer";
import { useRouter } from "next/router";
import Link from "next/link";

import RootLayout from "@/components/Layout/root";
import NotFound from "@/components/PageNotFound";
import VideoPlayer from "@/components/VideoPlayer";
import MenuDishSkeleton from "@/components/SkeletonPlaceholders/MenuDish";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  getCategoriesData,
  getDishesData,
  getRestaurantData,
  setCategoryState,
  setMenusState,
  setRestaurantsState,
} from "@/store/restaurant/slice";
import withScrollRestoration from "@/components/withScrollRestoration";
import { setScreenHeightState } from "@/store/slice";

const RestaurantMenu = ({
  restaurantInfo,
  categories,
  menus,
}: {
  restaurantInfo: any;
  categories: any;
  menus: any;
}) => {
  const router = useRouter();
  const { restaurant } = router.query;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);

  console.log(1);

  const screenHeight = useAppSelector((state) => state.app.screenHeight);

  const dispatch = useAppDispatch();
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const restaurantsState = useAppSelector(
    (state) => state.restaurant.restaurants
  );
  const restaurantCategoriesState = useAppSelector(
    (state) => state.restaurant.categories
  );
  const restaurantMenusState = useAppSelector(
    (state) => state.restaurant.menus
  );

  // restaurant
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(
    restaurantInfo ? false : true
  );
  const [restaurantData, setRestaurantData] = useState<any | null>(
    restaurantInfo
  );

  // restaurant categories
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(
    categories ? false : true
  );
  const [categoriesData, setCategoriesData] = useState<any[] | null>(
    categories
  );

  console.log(2);

  // restaurant menus
  const [isDishesLoading, setIsDishesLoading] = useState(menus ? false : true);
  const [menusData, setMenuData] = useState<any[] | null>(menus);

  console.log(3);

  useEffect(() => {
    console.log(4);

    dispatch(setScreenHeightState(window.innerHeight));
    console.log(5);

    const fetchRestaurantData = async () => {
      if (suffix) {
        try {
          const { data, error } = await getRestaurantData(suffix);
          if (error) throw error;

          dispatch(setRestaurantsState({ id: suffix!, data: data }));
          setRestaurantData(data);
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        } finally {
          setIsRestaurantLoading(false);
        }
      }
    };

    const fetchCategoriesData = async () => {
      if (suffix) {
        try {
          const { data, error } = await getCategoriesData(suffix);
          if (error) throw error;

          dispatch(setCategoryState({ id: suffix!, data: data }));
          setCategoriesData(data);
        } catch (error) {
          console.error("Error fetching categpries data:", error);
        } finally {
          setIsCategoriesLoading(false);
        }
      }
    };

    const fetchDishes = async () => {
      if (suffix) {
        try {
          const { data: dishes, error } = await getDishesData(suffix);
          if (error) throw error;

          dispatch(setMenusState({ id: suffix!, data: dishes }));
          setMenuData(dishes);
        } catch (error) {
          console.error("Error fetching dishes data:", error);
        } finally {
          setIsDishesLoading(false);
        }
      }
    };

    console.log(6);

    if (!restaurantInfo) {
      console.log(7);
      if (restaurantsState.length == 0) {
        console.log(8);
        fetchRestaurantData();
        fetchCategoriesData();
        fetchDishes();
      } else {
        console.log(9);
        if (restaurantsState.some((item: any) => item.id == suffix!)) {
          console.log(10);
          setRestaurantData(
            restaurantsState.filter((item: any) => item.id === suffix!)[0].data
          );
          setIsCategoriesLoading(false);
          setCategoriesData(
            restaurantCategoriesState.filter(
              (item: any) => item.id === suffix!
            )[0].data
          );
          setIsCategoriesLoading(false);
          setMenuData(
            restaurantMenusState.filter((item: any) => item.id === suffix!)[0]
              .data
          );
          setIsDishesLoading(false);
        } else {
          console.log(11);
          restaurantData();
          fetchCategoriesData();
          fetchDishes();
        }
      }
    }

    window.addEventListener("resize", () => {
      dispatch(setScreenHeightState(window.innerHeight));
    });

    return () =>
      window.removeEventListener("resize", () =>
        dispatch(setScreenHeightState(window.innerHeight))
      );
  }, [suffix, dispatch]);

  const resizableRestaurantDivRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const resizableRestaurantDiv = resizableRestaurantDivRef.current;
      if (!resizableRestaurantDiv || scrolled) return;

      if (window.scrollY > 0) {
        resizableRestaurantDiv.style.height = "60vh";
        setScrolled(true);
      }
    };

    const handleScrollUp = () => {
      const resizableRestaurantDiv = resizableRestaurantDivRef.current;
      if (!resizableRestaurantDiv || !scrolled) return;

      if (window.scrollY === 0) {
        resizableRestaurantDiv.classList.add("smooth-resize");
        resizableRestaurantDiv.style.height = "100vh";
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScrollUp);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollUp);
    };
  }, [scrolled]);

  return (
    <>
      {restaurantData ? (
        <RootLayout manageHeaderColor={true}>
          <section className="hidden sm:block select-none animated-fade">
            <div className="pb-28">
              <div className="relative mx-auto mb-16 capitalize">
                <div
                  className={`w-full ${!isPageReset ? "animated-fade-y" : ""}`}
                  style={{
                    height: screenHeight != 0 ? screenHeight + "px" : "100vh",
                  }}
                >
                  {restaurantData.images ? (
                    <Image
                      src={restaurantData.images[0]}
                      fill
                      alt="restaurant-cover-image"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`absolute top-0 h-full w-full bg-black bg-opacity-60 ${
                    !isPageReset ? "animated-fade-y" : ""
                  }`}
                >
                  <div className="container h-full w-full">
                    <div
                      className={`absolute bottom-0 pb-20 ${
                        !isPageReset ? "animated-fade-y" : ""
                      }`}
                    >
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
                          <p>{restaurantData.phone}</p>
                        </div>
                        {/* <div className="flex items-center gap-2 lg:pr-5">
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {categoriesData ? (
                <div className="container">
                  <p className="my-6 text-3xl font-bold">Categories</p>
                  {isCategoriesLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 h-full w-full">
                      <div className="h-48 lg:h-52 xl:h-72 bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
                      <div className="bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
                      <div className="hidden lg:block bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 h-full w-full">
                      {categoriesData.map((item: any, index: any) => (
                        <Link
                          key={"dish-key-" + index}
                          href={
                            restaurant +
                            "/categories/" +
                            encodeURIComponent(
                              item.name.toLowerCase().replace(/\s+/g, "-")
                            ) +
                            "-" +
                            btoa(item.id.toString())
                          }
                          className="relative h-full cursor-pointer border border-gray-300 dark:border-gray-700 px-2 py-7 flex flex-col gap-5"
                        >
                          <div className="h-full capitalize text-center">
                            <p className="mb-2 font-bold text-lg">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                          <div className="px-5">
                            <Image
                              src={item.image}
                              height={100}
                              width={100}
                              className="h-48 lg:h-52 xl:h-72 w-full object-cover"
                              alt="item-image"
                              loading="lazy"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
              {menusData ? (
                <div className="container">
                  {menusData.map((item: any, index: any) =>
                    item.dishes.length > 0 ? (
                      <div
                        key={"desktop-menu-" + index}
                        id={"desktop-menu-" + item.id}
                      >
                        <InView triggerOnce>
                          {({ inView, ref, entry }) => (
                            <div
                              ref={ref}
                              className={`mt-20 flex w-full flex-col gap-5 ${
                                inView
                                  ? !isPageReset
                                    ? "animated-fade-y"
                                    : ""
                                  : ""
                              }`}
                            >
                              <p className="border-b border-black border-opacity-10 pb-2 text-3xl font-bold dark:border-white dark:border-opacity-30">
                                {item.name}
                              </p>
                              {isDishesLoading ? (
                                <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {Array.from({ length: 4 }).map((_, index) => (
                                    <MenuDishSkeleton
                                      key={"menu-dish-skeleton-" + index}
                                      classes="h-[30rem]"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {item.dishes.map((data: any) => (
                                    <div
                                      key={"desktop-dish-" + data.id}
                                      id={"desktop-dish-" + data.id}
                                      className={`relative w-full h-[30rem] ${
                                        !isPageReset ? "animated-fade-y" : ""
                                      }`}
                                    >
                                      {data.video ? (
                                        <VideoPlayer
                                          src={data.video}
                                          poster={data.video_thumbnail}
                                          classes={
                                            "h-full w-full rounded-xl object-cover"
                                          }
                                        />
                                      ) : (
                                        <Swiper
                                          modules={[Autoplay, EffectFade]}
                                          slidesPerView={1}
                                          loop={true}
                                          autoplay={true}
                                          effect="fade"
                                          className="h-full w-full rounded-xl"
                                        >
                                          {data.images.map((data: any) => (
                                            <div
                                              key={"desktop-image-" + data}
                                              id={"image-" + data}
                                            >
                                              <SwiperSlide>
                                                <Image
                                                  src={data}
                                                  fill
                                                  alt="menu-dish-image"
                                                  className="h-full w-full object-cover"
                                                />
                                              </SwiperSlide>
                                            </div>
                                          ))}
                                        </Swiper>
                                      )}
                                      <div className="absolute top-0 z-[1] h-full w-full rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                        <div className="w-full absolute bottom-0 flex flex-col gap-2 px-4 pb-4 text-gray-200 dark:text-gray-300">
                                          <div className="flex items-center justify-between gap-5 border-b border-gray-300 border-opacity-30 pb-1 text-xl font-bold">
                                            <p className="min-w-2/5 text-white">
                                              {data.name}
                                            </p>
                                            <p className="text-lg">
                                              ₹{data.price}
                                            </p>
                                          </div>
                                          <p className="text-xs">
                                            {data.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </InView>
                      </div>
                    ) : (
                      ""
                    )
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </section>
          <section className="sm:hidden">
            <div className="scrollbar-hidden mb-20 animated-fade">
              <div
                ref={resizableRestaurantDivRef}
                className={`relative capitalize mb-16 ${
                  !isPageReset ? "smooth-resize" : ""
                }`}
                style={{
                  height: screenHeight != 0 ? screenHeight + "px" : "100vh",
                }}
              >
                <div className="h-full w-full">
                  {restaurantData.images ? (
                    <Image
                      src={restaurantData.images[0]}
                      fill
                      alt="restaurant-cover-image"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="absolute top-0 h-full w-full bg-black bg-opacity-60">
                  <div className="h-full w-full">
                    <div className="w-full absolute bottom-0 px-5 pb-5">
                      <div className="text-3xl font-bold text-white">
                        {restaurantData.name}
                      </div>
                      <p className="mt-4 border-b border-white/10 pb-5 text-base text-white">
                        {restaurantData.description}
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
                          <p>{restaurantData.address}</p>
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
                          <p>{restaurantData.phone}</p>
                        </div>
                        {/* <div className="flex items-center gap-2">
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
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="scrollbar-hidden mx-3 mb-24">
                <p className="my-6 text-center text-3xl font-bold">
                  Categories
                </p>
                {isCategoriesLoading ? (
                  <div className="h-52 w-full bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
                ) : categoriesData ? (
                  <div className="flex flex-col gap-5 h-full w-full">
                    {categoriesData.map((item: any, index: any) => (
                      <Link
                        key={"cat-dish-key-" + index}
                        href={
                          restaurant +
                          "/categories/" +
                          encodeURIComponent(
                            item.name.toLowerCase().replace(/\s+/g, "-")
                          ) +
                          "-" +
                          btoa(item.id.toString())
                        }
                        className="relative h-full cursor-pointer border border-gray-300 dark:border-gray-700 px-2 py-7 flex flex-col gap-5"
                      >
                        <div className="capitalize text-center">
                          <p className="mb-2 font-bold text-lg">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                        <div className="px-5">
                          <Image
                            src={item.image}
                            height={100}
                            width={100}
                            className="h-52 w-full object-cover"
                            alt="item-image"
                            loading="lazy"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
              {menusData ? (
                <div className="scrollbar-hidden mx-3">
                  <div className="text-center mb-5 border-b dark:border-white dark:border-opacity-30 border-black border-opacity-10 pb-2">
                    <p className="text-3xl font-bold mb-3">Menus</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Explore the artistry of cuisine with our thoughtfully
                      curated menu.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 h-full w-full">
                    {menusData.map((item: any, index: any) =>
                      item.dishes.length > 0 ? (
                        <Link
                          key={"dish-key-" + index}
                          href={
                            restaurant +
                            "/menus/" +
                            encodeURIComponent(
                              item.name.toLowerCase().replace(/\s+/g, "-")
                            ) +
                            "-" +
                            btoa(item.id.toString())
                          }
                          className="relative h-48 cursor-pointer"
                        >
                          {item.dishes[0].video ? (
                            <VideoPlayer
                              src={item.dishes[0].video}
                              poster={item.dishes[0].video_thumbnail}
                              classes={"h-full w-full object-cover rounded-xl"}
                            />
                          ) : (
                            <Swiper
                              modules={[Autoplay, EffectFade]}
                              slidesPerView={1}
                              loop={true}
                              autoplay={true}
                              effect="fade"
                              className="h-full rounded-xl"
                            >
                              {item.dishes[0].images?.map(
                                (data: any, index: any) => (
                                  <SwiperSlide
                                    key={"menus-dish-swiper-image-" + index}
                                  >
                                    <Image
                                      src={data}
                                      height={100}
                                      width={100}
                                      className="h-full w-full object-cover"
                                      alt="item-image"
                                      loading="lazy"
                                    />
                                  </SwiperSlide>
                                )
                              )}
                            </Swiper>
                          )}
                          <div className="absolute top-0 z-[1] h-full w-full bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl">
                            <div className="absolute bottom-2 w-full z-[1] px-3 text-white">
                              <p className="font-extrabold">{item.name}</p>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </section>
        </RootLayout>
      ) : isRestaurantLoading ? (
        <div className="h-screen pb-20">
          <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export async function getServerSideProps(context: any) {
  const { params, req } = context;
  const { restaurant } = params;
  const suffix = restaurant
    ?.toString()
    .substring(restaurant?.lastIndexOf("-") + 1);

  if (req.url != "/restaurants/" + restaurant) {
    return {
      props: {
        restaurantInfo: null,
        categories: null,
        menus: null,
      },
    };
  }

  const fetchRestaurantData = async () => {
    if (suffix) {
      try {
        const { data, error } = await getRestaurantData(suffix);
        if (error) throw error;

        return data;
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        return null;
      }
    }
  };

  const restaurantInfo = await fetchRestaurantData();

  const fetchCategoriesData = async () => {
    if (suffix) {
      try {
        const { data, error } = await getCategoriesData(suffix);
        if (error) throw error;

        return data;
      } catch (error) {
        console.error("Error fetching categpries data:", error);
        return null;
      }
    }
  };

  const categories = await fetchCategoriesData();

  const fetchDishes = async () => {
    if (suffix) {
      try {
        const { data: dishes, error } = await getDishesData(suffix);
        if (error) throw error;

        return dishes;
      } catch (error) {
        console.error("Error fetching dishes data:", error);
        return null;
      }
    }
  };

  const menus = await fetchDishes();

  return {
    props: {
      restaurantInfo,
      categories,
      menus,
    },
  };
}

export default withScrollRestoration(RestaurantMenu);
