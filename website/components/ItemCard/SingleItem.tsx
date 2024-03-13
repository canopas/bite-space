import Image from "next/image";

const SingleItem = ({ item }: { item: any }) => {
  const { id, name, tags, image, video, price, rating, restaurants } = item;
  return (
    <>
      <div
        className="wow fadeInUp relative flex h-full flex-col overflow-hidden rounded-xl bg-gradient-to-r from-white to-black shadow-one"
        style={{ backgroundImage: `url(${image})` }}
        data-wow-delay=".1s"
      >
        <div className="relative block h-[20rem] w-full">
          {video ? (
            <video
              loop
              autoPlay
              muted
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
          className={`flex-auto bg-black bg-opacity-70 p-5 text-white ${
            video ? "z-[1]" : ""
          }`}
        >
          <div className="mb-4">
            <div className="dark:text-whit block text-xl font-bold">{name}</div>
            <p className="text-sm">{tags ? tags.join(", ") : " "}</p>
          </div>
          <div className="mb-4 flex justify-between border-b border-white border-opacity-20 pb-4 text-base font-medium">
            <div className="flex gap-5">
              <p>⭐ {rating}</p>
            </div>
            <div className="text-lg font-bold text-white/70">₹{price}</div>
          </div>
          <div className="">
            <div className="text-xl font-bold hover:text-primary dark:hover:text-primary sm:text-2xl">
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
