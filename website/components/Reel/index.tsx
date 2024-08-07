"use client";

import React, { useEffect, useRef, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import MenuDishSkeleton from "@/components/SkeletonPlaceholders/MenuDish";
import NoDataFound from "../NoDataFound";
import SwiperComponent from "./swiper";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setScreenHeightState } from "@/store/slice";

import "swiper/css";
import "swiper/css/effect-fade";

interface ReelProps {
  dishesData: any;
}

const Reels = ({ dishesData }: ReelProps) => {
  const dispatch = useAppDispatch();
  const screenHeight = useAppSelector((state) => state.app.screenHeight);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [numDivsToRender, setNumDivsToRender] = useState(2); // Initial number of dish to render

  useEffect(() => {
    setIsLoading(true);

    if (carouselRef.current) {
      carouselRef.current.scrollTop = 0;

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [dishesData]);

  useEffect(() => {
    if (screenHeight == 0) {
      dispatch(setScreenHeightState(window.innerHeight));
    }

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
  }, [
    carouselRef,
    numDivsToRender,
    dishesData?.length,
    screenHeight,
    dispatch,
  ]);

  return (
    <section className="select-none">
      {isLoading ? (
        <MenuDishSkeleton
          classes="reel"
          style={{
            height: screenHeight != 0 ? screenHeight + "px" : "100vh",
          }}
        />
      ) : (
        ""
      )}
      <div
        ref={carouselRef}
        className="reelsContainer scrollbar-hidden w-full"
        style={{
          height: screenHeight != 0 ? screenHeight + "px" : "100vh",
        }}
      >
        {dishesData.length > 0 ? (
          dishesData.slice(0, numDivsToRender).map((data: any, index: any) => (
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
              {!isLoading ? (
                <div className="animated-fade">
                  {data.video ? (
                    <div
                      style={{
                        height:
                          screenHeight != 0 ? screenHeight + "px" : "100vh",
                      }}
                    >
                      <VideoPlayer
                        src={data.video}
                        poster={data.video_thumbnail}
                        classes={"h-full w-full object-cover"}
                      />
                    </div>
                  ) : (
                    <SwiperComponent images={data.images}></SwiperComponent>
                  )}
                  <div className="absolute bottom-0 z-[1] flex h-full w-full flex-col gap-2 bg-gradient-to-t from-black/80 via-transparent to-black/60 p-5 pb-5 text-white">
                    <div className="flex h-full items-end justify-between gap-5 text-xl font-bold">
                      <p className="min-w-2/5">{data.name}</p>
                      <p className="text-lg text-white/70">₹{data.price}</p>
                    </div>
                    <p
                      className={`text-sm pt-2 ${
                        data.description && data.description != ""
                          ? "border-t border-gray-300 border-opacity-30"
                          : ""
                      }`}
                    >
                      {data.description}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))
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
