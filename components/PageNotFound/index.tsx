import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";

const NotFound = () => {
  const isPageReset = useAppSelector((state) => state.app.isPageReset);
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
    <div className="select-none">
      <div
        className={`flex w-full ${!isPageReset ? "animated-fade-y" : ""}`}
        style={{
          height: screenHeight != 0 ? screenHeight + "px" : "100vh",
        }}
      >
        <Image
          className="object-cover w-full h-full"
          src="/images/not-found.webp"
          alt="Not Found Image"
          fill
          loading="lazy"
        />
      </div>
      <div
        className={`absolute top-0 bg-black w-full bg-opacity-60 ${
          !isPageReset ? "animated-fade-y" : ""
        }`}
        style={{
          height: screenHeight != 0 ? screenHeight + "px" : "100vh",
        }}
      >
        <div className="container h-full items-center justify-center text-white flex flex-col">
          <div className="text-3xl sm:text-5xl md:text-7xl font-extrabold border-b border-primary pb-2 sm:pb-3 md:pb-5">
            Not Found
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
