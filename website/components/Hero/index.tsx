"use client";

import Image from "next/image";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
// import "./typewriter";

const Hero = () => {
  return (
    <>
      <div className="relative z-10 overflow-hidden">
        <div className="h-screen">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            autoplay={true}
            className="h-screen"
          >
            <SwiperSlide>
              <Image
                src="/images/banner/1.webp"
                className="h-full w-full object-cover"
                alt="banner-slide-image"
                height={100}
                width={100}
                priority
              />
            </SwiperSlide>
            <SwiperSlide>
              <div className="h-full w-full">
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/2.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                  <Image
                    src="/images/banner/3.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                </div>
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/4.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                  <Image
                    src="/images/banner/5.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="h-full w-full">
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/6.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                  <Image
                    src="/images/banner/7.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                </div>
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/8.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                  <Image
                    src="/images/banner/9.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                    priority
                  />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="h-full w-full">
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/10.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                  />
                  <Image
                    src="/images/banner/11.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="flex h-1/2 w-full">
                  <Image
                    src="/images/banner/12.webp"
                    className="h-full w-3/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                  />
                  <Image
                    src="/images/banner/13.webp"
                    className="h-full w-1/4 object-cover"
                    alt="banner-slide-image"
                    height={50}
                    width={50}
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div className="w-full">
        <div className="absolute top-0 z-10 h-screen w-full bg-black bg-opacity-60">
          <div className="flex h-full select-none flex-col gap-2 capitalize text-white md:gap-5">
            <div className="flex h-1/2 items-end justify-center text-xl font-extrabold sm:text-3xl md:text-5xl xl:text-7xl">
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
            <div className="hidden text-center text-xs sm:block md:text-base xl:mt-5 xl:text-xl">
              Where passion meets the palate – Welcome to a world of culinary
              delight!
            </div>
            {/* <div className="mt-2 flex justify-center p-3 text-center text-white xs:p-0">
              <Link
                href="/search"
                className="flex w-96 cursor-pointer items-center gap-2 rounded-full border-2 bg-white bg-opacity-20 p-2 pl-3 md:gap-3 md:p-4"
              >
                <svg viewBox="0 0 20 21" className="h-4 fill-current md:h-5">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.0998 8.84232C13.0998 11.7418 10.7493 14.0922 7.84989 14.0922C4.95046 14.0922 2.6 11.7418 2.6 8.84232C2.6 5.94289 4.95046 3.59243 7.84989 3.59243C10.7493 3.59243 13.0998 5.94289 13.0998 8.84232ZM12.1431 14.1802C10.9686 15.1261 9.47534 15.6922 7.84989 15.6922C4.0668 15.6922 1 12.6254 1 8.84232C1 5.05923 4.0668 1.99243 7.84989 1.99243C11.633 1.99243 14.6998 5.05923 14.6998 8.84232C14.6998 10.4974 14.1128 12.0153 13.1357 13.1993L18.319 17.9606C18.7226 18.3313 18.7359 18.9637 18.3483 19.3511C17.9634 19.7357 17.3365 19.7254 16.9645 19.3282L12.1431 14.1802Z"
                  ></path>
                </svg>
                <div
                  className="typewrite text-sm md:text-base"
                  data-period="2000"
                  data-type='[ "Hunt for Taste, Discover Delight", "Find Your Culinary Treasure Here.", "Where Every Bite Tells a Story?", "Explore the Gastronomic Universe" ]'
                >
                  <span className="wrap"></span>
                </div>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
