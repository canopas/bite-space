"use client";

import BottomSheet from "@/components/BottomSheet";
import NoDataFound from "@/components/NoDataFound";
import { useAppSelector } from "@/store/store";
import { RestaurantData } from "@/types/category-by-id";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <>
      {restaurantsData && restaurantsData.length > 0 ? (
        <div className="mt-12 flex flex-col gap-5">
          <p className="text-2xl font-bold">Restaurants to explore</p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {restaurantsData.map((item, index) => (
              <div
                className="h-full w-full relative"
                key={"explore-restaurant-" + index}
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
                    "/categories/" +
                    encodeURIComponent(
                      item.category.name.toLowerCase().replace(/\s+/g, "-")
                    ) +
                    "-" +
                    btoa(item.category.id.toString())
                  }
                >
                  <Image
                    src={item.category.image as string}
                    className="h-60 w-full border-b border-black object-cover pb-2 dark:border-white/40 sm:h-[30rem]"
                    alt="item-image"
                    height={100}
                    width={100}
                  />
                </Link>
                <div
                  onClick={() => openBottomSheet(item.name, item.dishes)}
                  className="sm:hidden"
                >
                  <Image
                    src={item.category.image as string}
                    className="h-60 w-full border-b border-black object-cover pb-2 dark:border-white/40 sm:h-[30rem]"
                    alt="item-image"
                    height={100}
                    width={100}
                  />
                </div>
                <Link
                  href={
                    "/restaurants/" +
                    encodeURIComponent(
                      item.name.toLowerCase().replace(/\s+/g, "-")
                    ) +
                    "-" +
                    btoa(item.id.toString())
                  }
                  className={`w-full absolute bottom-[4.75rem] xs:bottom-14 md:bottom-[5.25rem] group cursor-pointer ${
                    !isPageReset ? "animated-fade-y" : ""
                  }`}
                >
                  <p className="w-full bg-black bg-opacity-40 py-2 pl-5 text-xl font-extrabold capitalize text-white dark:border-white sm:text-2xl">
                    {item.name}
                  </p>
                </Link>
                <div>
                  <p className="mt-3 text-sm sm:text-base">{item.address}</p>
                  <div className="mt-4 flex w-full flex-col gap-2">
                    <div className="flex items-center justify-between font-extrabold">
                      {item.reviews > 0 ? (
                        <p>
                          {item.reviews}{" "}
                          <span className="text-sm font-normal"> Reviews</span>
                        </p>
                      ) : (
                        ""
                      )}
                      {item.rating > 0 ? (
                        <p className="px-4 sm:py-2">⭐ {item.rating}</p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
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
