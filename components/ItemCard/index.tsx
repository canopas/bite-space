"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import SectionTitle from "../Common/SectionTitle";
import SingleItem from "./SingleItem";
import supabase from "@/utils/supabase";
import { InView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setFoodItemsState } from "@/store/home/slice";
import { getItemCardData } from "@/store/category/slice";

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
          title="Most browsed items from the location"
          paragraph="Connect Locally: Must-Visit Places in Your Neighborhood. In our vibrant community, explore top-rated local experiences."
          customClass="mb-12 xl:mb-28"
        />
        {itemsData ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {itemsData.map((item: any, index: any) => (
              <div key={"item-card-" + index}>
                <InView
                  triggerOnce
                  className={`${!isPageReset ? "animated-fade-y" : ""}`}
                >
                  {({ inView, ref, entry }) => (
                    <Link
                      ref={ref}
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
                      className={`h-full w-full ${
                        inView ? (!isPageReset ? "animated-fade-y" : "") : ""
                      }`}
                    >
                      <SingleItem item={item} />
                    </Link>
                  )}
                </InView>
              </div>
            ))}
          </div>
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