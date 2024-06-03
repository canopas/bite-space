import { useState } from "react";
import Image from "next/image";

const LoadImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      height={100}
      width={100}
      className={`w-full transition-opacity duration-[2000]  ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default LoadImage;
