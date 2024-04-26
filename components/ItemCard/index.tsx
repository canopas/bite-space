"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import SectionTitle from "../Common/SectionTitle";
import SingleItem from "./SingleItem";
import supabase from "@/utils/supabase";
import { InView } from "react-intersection-observer";

const ItemCard = () => {
  const [error, setError] = useState<any | null>(null);
  const [itemData, setMostBrowsedItemData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu IDs associated with public restaurants
        const { data: menusData, error: menuError } = await supabase
          .from("menus")
          .select("id, restaurants(id)")
          .eq("restaurants.is_public", true)
          .not("restaurants", "is", null);

        if (menuError) throw menuError;

        // Extract menu IDs
        const menuIds = menusData.map((menu) => menu.id);

        // Fetch dishes associated with the obtained menu IDs
        const { data: dishesData, error: dishesError } = await supabase
          .from("dishes")
          .select("*, menus(id, restaurants(id, name, address))")
          .in("menu_id", menuIds)
          .order('id', { ascending: true })
          .limit(9);

        if (dishesError) throw dishesError;

        const restaurant = await Promise.all(
          dishesData.map(async (dish) => {
            return {
              ...dish,
              image: dish.images ? dish.images[0] : "",
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
    <section className="bg-primary bg-opacity-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Most browsed items from the location"
          paragraph="Connect Locally: Must-Visit Places in Your Neighborhood. In our vibrant community, explore top-rated local experiences."
          customClass="mb-12 sm:mb-28"
        />
        {itemData ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {itemData.map((item: any, key: any) => (
              <div key={"item-card-" + key}>
                <InView triggerOnce className="animated-fade-y">
                  {({ inView, ref, entry }) => (
                    <Link
                      target="_top"
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
