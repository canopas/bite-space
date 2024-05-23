"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import VideoPlayer from "@/components/VideoPlayer";
import MenuDishSkeleton from "@/components/SkeletonPlaceholders/MenuDish";
import NoDataFound from "../NoDataFound";
import SwiperComponent from "./swiper";
import "swiper/react";
import { useAppSelector } from "@/store/store";

interface ReelProps {
  dishesData: any;
  isDishesLoading: boolean;
}

const Reels = ({ dishesData, isDishesLoading }: ReelProps) => {
  const screenHeight = useAppSelector((state) => state.app.screenHeight);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [numDivsToRender, setNumDivsToRender] = useState(2); // Initial number of dish to render

  useEffect(() => {
    const observerOptions = {
      root: null, // The viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the dish is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Increase the number of dish to render
          setNumDivsToRender((prevNumDivs) =>
            Math.min(prevNumDivs + 1, dishesData?.length)
          );
        }
      });
    }, observerOptions);

    const currentCarouselRef = carouselRef.current;
    if (currentCarouselRef) {
      // Observe the last dish to trigger additional dish loading
      const lastDiv = currentCarouselRef.querySelector(
        `#menu-dish-${numDivsToRender - 1}`
      );
      if (lastDiv) {
        observer.observe(lastDiv);
      }

      return () => {
        if (lastDiv) {
          observer.unobserve(lastDiv);
        }
      };
    }
  }, [carouselRef, numDivsToRender, dishesData?.length]);

  return (
    <section className="select-none">
      <div
        className="reelsContainer scrollbar-hidden animated-fade"
        style={{
          height: screenHeight != 0 ? screenHeight + "px" : "100vh",
        }}
      >
        {isDishesLoading ? (
          <div className="reelsContainer scrollbar-hidden w-full">
            <MenuDishSkeleton classes="reel" />
          </div>
        ) : dishesData.length > 0 ? (
          <div
            ref={carouselRef}
            className="reelsContainer scrollbar-hidden w-full"
            style={{
              height: screenHeight != 0 ? screenHeight + "px" : "100vh",
            }}
          >
            {dishesData
              .slice(0, numDivsToRender)
              .map((data: any, index: any) => (
                <div
                  key={"menu-dish-key-" + index}
                  id={`menu-dish-${index}`}
                  className={`reel relative carousel-item ${
                    data ? "animated-fade" : ""
                  }`}
                  style={{
                    height: screenHeight != 0 ? screenHeight + "px" : "100vh",
                  }}
                >
                  {data.video ? (
                    <VideoPlayer
                      src={data.video}
                      poster={data.video_thumbnail}
                      classes={"h-full w-full object-cover"}
                    />
                  ) : (
                    <SwiperComponent images={data.images}></SwiperComponent>
                  )}
                  <div className="absolute bottom-0 z-[1] flex h-full w-full flex-col gap-2 bg-gradient-to-t from-black/80 via-transparent to-black/60 p-5 pb-5 text-white">
                    <div className="flex h-full items-end justify-between gap-5 text-xl font-bold">
                      <p className="min-w-2/5">{data.name}</p>
                      <p className="text-lg text-white/70">₹{data.price}</p>
                    </div>
                    {data.description && data.description != "" ? (
                      <p className="border-t border-white/10 text-sm pt-2">
                        {data.description}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              height: screenHeight != 0 ? screenHeight + "px" : "100vh",
            }}
          >
            <NoDataFound text="😕 Oops, No dishes available at the moment!" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Reels;
