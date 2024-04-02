import { ItemProps } from "@/types/card-item";
import Image from "next/image";

const SingleItem = ({ item }: { item: ItemProps }) => {
  const {
    id,
    name,
    description,
    tags,
    image,
    video,
    price,
    rating,
    restaurants,
  } = item;
  return (
    <>
      <div
        className="wow fadeInUp relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-r from-white to-black shadow-one bg-cover"
        style={{ backgroundImage: `url(${image})` }}
        data-wow-delay=".1s"
      >
        <div className="relative block h-[20rem] w-full">
          {video ? (
            <video
              loop
              autoPlay
              muted
              playsInline
              webkit-playsinline
              className={` w-full object-cover ${
                video ? "h-[35rem]" : "h-full"
              }`}
            >
              <source src={video} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={image}
              alt="item-image"
              className="h-full w-full object-cover"
              height={100}
              width={100}
            />
          )}
        </div>
        <div
          className={`flex-auto bg-black bg-opacity-70 p-5 ${
            video ? "z-[1]" : ""
          }`}
        >
          <div className="mb-4 border-b border-gray-300 border-opacity-20 pb-4 text-gray-200 dark:text-gray-300">
            <div className="mb-3 flex justify-between text-lg font-bold">
              <p>{name}</p>
              <p>₹{price}</p>
            </div>
            <p className="text-xs">{description}</p>
          </div>
          <div className="text-white flex flex-col gap-2">
            <div className="text-xl font-bold sm:text-2xl">
              {restaurants.name}
            </div>
            <p className="text-sm">{restaurants.address}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleItem;
