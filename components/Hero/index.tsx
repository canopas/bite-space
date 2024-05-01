"use client";

import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { useEffect, useState } from "react";

const banners = [
  {
    400: "/images/banner/1-400w.webp",
    800: "/images/banner/1-800w.webp",
    1600: "/images/banner/1.webp",
    lazy: false,
  },
  {
    400: "/images/banner/2-400w.webp",
    800: "/images/banner/2-800w.webp",
    1600: "/images/banner/2.webp",
    lazy: false,
  },
  {
    400: "/images/banner/3-400w.webp",
    800: "/images/banner/3-800w.webp",
    1600: "/images/banner/3.webp",
    lazy: false,
  },
  {
    400: "/images/banner/4-400w.webp",
    800: "/images/banner/4-800w.webp",
    1600: "/images/banner/4.webp",
    lazy: true,
  },
  {
    400: "/images/banner/5-400w.webp",
    800: "/images/banner/5-800w.webp",
    1600: "/images/banner/5.webp",
    lazy: true,
  },
  {
    400: "/images/banner/6-400w.webp",
    800: "/images/banner/6-800w.webp",
    1600: "/images/banner/6.webp",
    lazy: true,
  },
  {
    400: "/images/banner/7-400w.webp",
    800: "/images/banner/7-800w.webp",
    1600: "/images/banner/7.webp",
    lazy: true,
  },
  {
    400: "/images/banner/8-400w.webp",
    800: "/images/banner/8-800w.webp",
    1600: "/images/banner/8.webp",
    lazy: true,
  },
  {
    400: "/images/banner/9-400w.webp",
    800: "/images/banner/9-800w.webp",
    1600: "/images/banner/9.webp",
    lazy: true,
  },
  {
    400: "/images/banner/10-400w.webp",
    800: "/images/banner/10-800w.webp",
    1600: "/images/banner/10.webp",
    lazy: true,
  },
];

const Hero = () => {
  const [screenHeight, setScreenHeight] = useState<number>(0);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
    
    window.addEventListener("resize", () =>
      setScreenHeight(window.innerHeight)
    );
    return () =>
      window.removeEventListener("resize", () =>
        setScreenHeight(window.innerHeight)
      );
  }, []);

  return (
    <>
      <div className="relative z-10 overflow-hidden">
        <div
          style={{ height: screenHeight != 0 ? screenHeight + "px" : "100vh" }}
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={true}
            className="h-full"
          >
            {banners.map((banner, key) => (
              <SwiperSlide key={key}>
                <img
                  src={banner[400]}
                  srcSet={`${banner[400]} 400w, ${banner[800]} 800w, ${banner[1600]} 1600w`}
                  className="h-full w-full object-cover"
                  alt="banner-slide-image"
                  loading={banner.lazy ? "lazy" : "eager"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="w-full">
        <div
          className="absolute top-0 z-10 w-full bg-black bg-opacity-60"
          style={{ height: screenHeight != 0 ? screenHeight + "px" : "100vh" }}
        >
          <div className="flex h-full select-none flex-col capitalize text-white gap-5">
            <div className="flex flex-col xs:flex-row h-1/2 items-center justify-end xs:items-end xs:justify-center font-extrabold text-3xl md:text-5xl xl:text-7xl">
              Elevate your{" "}
              <span className="px-1 text-primary sm:px-2 md:px-4">
                {" "}
                dining{" "}
              </span>
              experience
            </div>
            <div className="text-center text-base font-bold sm:text-xl md:text-3xl xl:text-5xl">
              with <span className="text-primary"> every </span> bite.
            </div>
            <div className="text-center text-xs md:text-base xl:mt-5 xl:text-xl px-10 xs:px-0">
              Where passion meets the palate – Welcome to a world of culinary
              delight!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
