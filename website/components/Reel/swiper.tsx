import Image from "next/image";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

import { useEffect, useRef, useState } from "react";
import useAutoplayVisibility from "./hook";
import { useAppSelector } from "@/store/store";

type SwiperCore = any;

const SwiperComponent = ({ images }: { images: any }) => {
  const [autoplayEnabled, ref] = useAutoplayVisibility();
  const screenHeight = useAppSelector((state) => state.app.screenHeight);

  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      if (autoplayEnabled) {
        swiperRef.current.autoplay.start();
      } else {
        swiperRef.current.autoplay.stop();
      }
    }
  }, [autoplayEnabled]);

  return (
    <div ref={ref} className={`${autoplayEnabled}`}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          if (autoplayEnabled) {
            swiper.autoplay.start();
          }
        }}
        modules={[Autoplay, EffectFade]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        effect="fade"
        className="w-full"
        style={{
          height: screenHeight != 0 ? screenHeight + "px" : "100vh",
        }}
      >
        {images.map((imageUrl: any, index: any) => (
          <>
            <SwiperSlide key={"mobile-image-" + index}>
              <div
                className="h-full"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                }}
              >
                <div className="flex h-full w-full items-center bg-black bg-opacity-20 backdrop-blur-sm">
                  <Image
                    src={imageUrl}
                    height={100}
                    width={100}
                    alt="menu-dish-image"
                    className="w-full"
                  />
                </div>
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
