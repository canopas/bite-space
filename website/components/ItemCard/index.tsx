"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import SectionTitle from "../Common/SectionTitle";
import SingleItem from "./SingleItem";
import supabase from "@/utils/supabase";
import { InView } from "react-intersection-observer";

const ItemCard = () => {
  const [error, setError] = useState(null);
  const [itemData, setMostBrowsedItemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dishesData, error } = await supabase
          .from("dishes")
          .select("menu_id, name, price, images, video, tags")
          .range(0, 8);

        if (error) throw error;

        const restaurant = await Promise.all(
          dishesData.map(async (dish) => {
            const { data: menuData, error: menuError } = await supabase
              .from("menus")
              .select("*, restaurants(id, name, address)")
              .eq("id", dish.menu_id)
              .single();

            if (menuError) throw menuError;

            return {
              ...dish,
              ...menuData,
              image: dish.images[0],
              rating: 4.2,
            };
          })
        );

        setMostBrowsedItemData(restaurant);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      } finally {
        setError(null);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-primary/10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Most browsed items from the location"
          paragraph="Connect Locally: Must-Visit Places in Your Neighborhood. In our vibrant community, explore top-rated local experiences."
          customClass="mb-28"
        />
        {itemData ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {itemData.map((item) => (
              <div key={"item-card-" + item.id}>
                <InView triggerOnce>
                  {({ inView, ref, entry }) => (
                    <Link
                      ref={ref}
                      href={`/restaurants/${item.restaurant_id}/menu`}
                      className={`h-full w-full ${
                        inView ? "animated-fade-y" : ""
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
