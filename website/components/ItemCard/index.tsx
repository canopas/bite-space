"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import SectionTitle from "../Common/SectionTitle";
import SingleItem from "./SingleItem";
import supabase from "@/utils/supabase";

const ItemCard = () => {
  const [itemData, setMostBrowsedItemData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dishesData } = await supabase
          .from("dishes")
          .select("menu_id, name, price, images, video, tags")
          .range(0, 8);

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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const animateFoodItemsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = animateFoodItemsRef.current;

      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="bg-primary/10 py-16 md:py-20 lg:py-28">
      <div className="container" ref={animateFoodItemsRef}>
        <SectionTitle
          title="Most browsed items from the location"
          paragraph="Connect Locally: Must-Visit Places in Your Neighborhood. In our vibrant community, explore top-rated local experiences."
          customClass="mb-28"
        />
        {itemData ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
            {itemData.map((item) => (
              <Link
                href={`/restaurants/${item.restaurant_id}/menu`}
                key={"item-card-" + item.id}
                className={`animated-fade-y-on-scroll h-full w-full ${
                  isVisible ? "animate" : ""
                }`}
              >
                <SingleItem item={item} />
              </Link>
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
