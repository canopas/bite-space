"use client";

import BottomSheet from "@/components/BottomSheet";
import NoDataFound from "@/components/NoDataFound";
import { useAppDispatch } from "@/store/store";
import { RestaurantData } from "@/types/category-by-id";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { setScreenHeightState } from "@/store/slice";

const Restaurant = ({
  isRestaurantsLoading,
  restaurantsData,
}: {
  isRestaurantsLoading: boolean;
  restaurantsData: RestaurantData[];
}) => {
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
        <div className="flex flex-col gap-5">
          <div className="h-full flex flex-col gap-12 sm:gap-24">
            {restaurantsData.map((item, index) => (
              <div key={"explore-restaurant-" + index}>
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
                  <p className="text-xs sm:text-base flex flex-wrap gap-1">
                    <span className="hidden sm:block w-fit">
                      {item.address + ", "}
                    </span>
                    <span>{item.local_area + ", "}</span>
                    <span>{item.city + ", "}</span>
                    <span>{item.state + ", "}</span>
                    <span>{item.postal_code}</span>
                  </p>
                </Link>
                <div className="flex gap-5 h-full overflow-scroll scrollbar-hidden mt-6">
                  {item.menu.map((data, index) => (
                    <div key={"explore-restaurant-menu-" + index}>
                      <div
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
                            className="h-96 w-96 object-cover rounded-2xl"
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
                        <p className="mt-1 w-full sm:w-96 font-extrabold capitalize sm:text-xl text-center">
                          {data.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
