"use client";

import BottomSheet from "@/components/BottomSheet";
import NoDataFound from "@/components/NoDataFound";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { RestaurantData } from "@/types/category-by-id";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import { setScreenHeightState } from "@/store/slice";

const Restaurant = ({
  isRestaurantsLoading,
  restaurantsData,
}: {
  isRestaurantsLoading: boolean;
  restaurantsData: RestaurantData[];
}) => {
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentItemsName, setCurrentItemsName] = useState("");
  const [currentItems, setCurrentItems] = useState([]);

  const openBottomSheet = (name: string, items: any) => {
    setCurrentItemsName(name);
    setCurrentItems(items);
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setScreenHeightState(window.innerHeight));

    window.addEventListener("resize", () => {
      dispatch(setScreenHeightState(window.innerHeight));
    });

    return () =>
      window.removeEventListener("resize", () =>
        dispatch(setScreenHeightState(window.innerHeight))
      );
  }, [dispatch]);

  return (
    <>
      {restaurantsData && restaurantsData.length > 0 ? (
        <div className="mt-12 flex flex-col gap-5">
          <p className="text-2xl font-bold">Restaurants to explore</p>
          <div className="h-full flex flex-col gap-12 sm:gap-20">
            {restaurantsData.map((item, index) => (
              <div key={"explore-restaurant-" + index}>
                <Swiper
                  slidesPerView={"auto"}
                  spaceBetween={10}
                  autoplay={true}
                  modules={[Autoplay]}
                  className="h-full w-full mb-2 sm:mb-6"
                >
                  {item.menu.map((data, index) => (
                    <div key={"explore-restaurant-menu-" + index}>
                      <SwiperSlide
                        className={`!h-full ${
                          item.menu.length > 1 ? "!w-60 sm:!w-96" : "!w-full"
                        }`}
                      >
                        <Link
                          className="hidden sm:block"
                          href={
                            "/restaurants/" +
                            encodeURIComponent(
                              item.name.toLowerCase().replace(/\s+/g, "-")
                            ) +
                            "-" +
                            btoa(item.id.toString()) +
                            "/menus/" +
                            encodeURIComponent(
                              data.name.toLowerCase().replace(/\s+/g, "-")
                            ) +
                            "-" +
                            btoa(data.id.toString())
                          }
                        >
                          <Image
                            src={data.image}
                            className={`h-96 object-cover rounded-2xl ${
                              item.menu.length > 1 ? "w-96" : "w-full"
                            }`}
                            alt="item-image"
                            height={100}
                            width={100}
                          />
                        </Link>
                        <div
                          onClick={() =>
                            openBottomSheet(item.name, data.dishes)
                          }
                          className="sm:hidden cursor-pointer"
                        >
                          <Image
                            src={data.image as string}
                            className={`h-60 object-cover rounded-2xl ${
                              item.menu.length > 1 ? "w-60" : "w-full"
                            }`}
                            alt="item-image"
                            height={100}
                            width={100}
                          />
                        </div>
                        <div
                          className={`w-full absolute bottom-0 ${
                            !isPageReset ? "animated-fade-y" : ""
                          }`}
                        >
                          <p className="w-full bg-black bg-opacity-50 py-2 pl-5 font-extrabold capitalize text-white dark:border-white sm:text-2xl">
                            {data.name}
                          </p>
                        </div>
                      </SwiperSlide>
                    </div>
                  ))}
                </Swiper>
                <Link
                  href={
                    "/restaurants/" +
                    encodeURIComponent(
                      item.name.toLowerCase().replace(/\s+/g, "-")
                    ) +
                    "-" +
                    btoa(item.id.toString())
                  }
                >
                  <p className="w-full text-xl sm:text-2xl font-bold border-b dark:border-white/40 my-2 pb-1">
                    {item.name}
                  </p>
                  <p className="text-xs sm:text-base">{item.address}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : isRestaurantsLoading ? (
        <div className="mt-10 grid h-80 grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:h-60 xl:grid-cols-3">
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900"></div>
          <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
          <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
          <div className="hidden animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900 md:block"></div>
        </div>
      ) : (
        <NoDataFound text="😕 Oops, No restaurants available at the moment!" />
      )}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        name={currentItemsName}
        items={currentItems}
      />
    </>
  );
};

export default Restaurant;
