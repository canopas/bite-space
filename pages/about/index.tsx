"use client";

import RootLayout from "@/components/Layout/root";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const About = () => {
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
      <RootLayout manageHeaderColor={true}>
        <div className="select-none">
          <div
            className="flex w-full"
            style={{
              height: screenHeight != 0 ? screenHeight + "px" : "100vh",
            }}
          >
            <Image
              className="object-cover w-1/2 h-full"
              src="/images/about/burger.webp"
              alt="Background Image"
              height={100}
              width={100}
              loading="lazy"
            />
            <Image
              className="object-cover w-1/2 h-full"
              src="/images/about/pani-puri.webp"
              alt="Background Image"
              height={100}
              width={100}
              loading="lazy"
            />
          </div>
          <div
            className="absolute top-0 bg-black w-full bg-opacity-60 py-[10rem]"
            style={{
              height: screenHeight != 0 ? screenHeight + "px" : "100vh",
            }}
          >
            <div className="container h-full items-center justify-center text-white flex flex-col">
              <div className="text-3xl sm:text-5xl md:text-7xl font-extrabold border-b border-primary pb-2 sm:pb-3 md:pb-5">
                Cook<span className="text-primary">.</span> Share
                <span className="text-primary">.</span> Enjoy
                <span className="text-primary">.</span>
              </div>
              <p className="text-center text-xs md:text-base xl:text-xl mt-2 md:mt-3 lg:mt-4 xl:mt-5">
                we believe in simplifying your food journey, one delicious meal
                at a time.
              </p>
            </div>
          </div>
        </div>
        <div className="container py-10 md:py-20 lg:py-32 flex flex-col gap-16 sm:gap-32 md:gap-48 xl:gap-56 select-none">
          <div className="flex flex-col sm:flex-row w-full my-10 gap-5 sm:gap-0">
            <div className="pb-2 sm:pb-0 sm:w-1/2 border-b sm:border-b-0 sm:border-r border-primary border-opacity-50 pr-10 lg:pr-20 sm:flex sm:items-center sm:justify-end sm:text-right">
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium">
                At{" "}
                <span className="text-black dark:text-white font-extrabold">
                  Bite
                </span>{" "}
                <span className="text-primary font-extrabold">Space</span>,{" "}
                <br className="hidden sm:block" /> our mission is simple
              </p>
            </div>
            <p className="sm:w-1/2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl sm:pl-10 lg:pl-20 text-gray-600 dark:text-gray-400">
              to empower and inspire individuals to lead healthier, happier
              lives through better food choices. We believe that everyone
              deserves access to nutritious and delicious meals, and we are
              committed to making that a reality for our users.
            </p>
          </div>
          <div className="md:flex sm:gap-20">
            <div className="w-fit flex flex-col gap-2 md:gap-5">
              <p className="text-xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-9xl font-bold">
                History
              </p>
              <p className="bg-primary w-1/2 h-1 md:h-2"></p>
            </div>
            <p className="mt-8 md:mt-0 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-400">
              It all started with a simple desire – the craving to explore menus
              and dishes from all the restaurants, yet facing the frustration of
              limited options and scattered information. <br /> <br />
              Determined to bridge this gap and enhance the dining experience
              for everyone, we embarked on a journey fueled by our shared
              passion for food. <br /> <br /> What began as a longing for
              convenience evolved into a visionary project aimed at
              revolutionizing the way we approach food. From that moment of
              inspiration,{" "}
              <span className="text-black dark:text-white font-bold">
                Bite <span className="text-primary">Space</span>
              </span>{" "}
              was born. <br /> <br /> Today, our small idea has blossomed into a
              vibrant community of food enthusiasts, driven by a collective
              mission to make eating well easier and more enjoyable for
              everyone.
            </p>
          </div>
        </div>
        <div className="bg-primary bg-opacity-30 flex flex-col justify-center items-center gap-10 py-16 md:py-20 lg:py-32 my-20 select-none">
          <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
            Ready to embark on a culinary adventure with us?
          </p>
          <Link
            href="https://admin.bitespace.in/signin"
            target="_blank"
            className="w-fit bg-primary dark:bg-primary dark:bg-opacity-70 transition duration-500 px-7 py-3 text-base font-bold text-white rounded-xl hover:bg-transparent hover:dark:bg-transparent hover:text-primary border-2 border-transparent hover:border-primary"
          >
            Partner With Us
          </Link>
        </div>
        <div className="container md:py-14 lg:py-28 xl:py-32 flex flex-col select-none gap-28 sm:gap-40 md:gap-52 lg:gap-60 xl:gap-80">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-20 select-none sm:text-right border-l sm:border-l-0 sm:border-r border-primary border-opacity-50 pl-6 sm:pr-10 lg:pr-20 py-10 sm:py-16 md:py-24">
            <div className="w-full gap-5 flex items-center sm:justify-end">
              <div className="w-fit flex flex-col gap-2 md:gap-5">
                <p className="text-xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-bold">
                  Values
                </p>
                <p className="bg-primary w-1/2 h-1 md:h-2"></p>
              </div>
            </div>
            <p className="w-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-400">
              At{" "}
              <span className="text-black dark:text-white font-bold">Bite</span>{" "}
              <span className="text-primary font-bold">Space</span>, we are
              guided by a set of core values that shape everything we do. <br />
              Integrity, innovation, and inclusivity are at the heart of our
              work, and we are committed to upholding these principles in every
              aspect.{" "}
            </p>
          </div>
          <div className="flex flex-col gap-8 lg:gap-20 mb-32">
            <div className="w-fit flex flex-col gap-2 md:gap-5">
              <p className="text-xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-8xl font-bold">
                Have a question or feedback for us?
              </p>
              <p className="bg-primary w-1/4 h-1 md:h-2"></p>
            </div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-400">
              We&apos;d love to hear from you! Drop us a line at{" "}
              <Link
                href="mailto:contact@bitespace.in"
                className="opacity-80 dark:opacity-100 underline font-semibold"
              >
                contact@bitespace.in
              </Link>
            </p>
          </div>
        </div>
      </RootLayout>
    </>
  );
};

export default About;
