import { ItemProps } from "@/types/card-item";
import Image from "next/image";

const SingleItem = ({ item }: { item: ItemProps }) => {
  const { name, description, image, video } =
    item;
  return (
    <>
      <div
        className="wow fadeInUp relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-r from-white to-black shadow-one bg-cover"
        style={{ backgroundImage: `url(${image})` }}
        data-wow-delay=".1s"
      >
        <div className="relative block h-[25rem] w-full">
          <Image
            src={image}
            alt="item-image"
            className="h-full w-full object-cover"
            height={100}
            width={100}
            loading="lazy"
          />
        </div>
        <div
          className={`flex-auto bg-black bg-opacity-70 p-5 ${
            video ? "z-[1]" : ""
          }`}
        >
          <div className="text-gray-200 dark:text-gray-300 text-center">
            <p className="text-white mb-3 text-lg font-bold border-b border-gray-300 border-opacity-20">
              {name}
            </p>
            <p className="text-xs">{description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleItem;
