import Image from "next/image";
import { useEffect, useState } from "react";

const NotFound = () => {
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
        className="animated-fade-y flex w-full"
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
        className="animated-fade-y absolute top-0 bg-black w-full bg-opacity-60"
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
