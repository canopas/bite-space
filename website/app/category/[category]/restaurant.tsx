"use client";

import Image from "next/image";
import Link from "next/link";

const RestaurantsPage = ({
  isLoading,
  restaurantsData,
}: {
  isLoading: boolean;
  restaurantsData: any[];
}) => {
  return (
    <>
      {isLoading ? (
        <section>
          <div className="py-20 text-center text-black/40 dark:text-white/70">
            Loading...
          </div>
        </section>
      ) : (
        <section className="">
          {restaurantsData.length > 0 ? (
            <div className="mt-12 flex flex-col gap-5">
              <p className="text-2xl font-bold">Restaurants to explore</p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {restaurantsData.map((item) => (
                  <Link
                    href={`/restaurants/${item.id}/menu`}
                    key={"may-like-" + item.id}
                    className="animated-fade-y group relative h-full cursor-pointer"
                  >
                    {item.video ? (
                      <video
                        className="h-60 w-full border-b border-black object-cover pb-2 dark:border-white/40 sm:h-[30rem]"
                        autoPlay
                        loop
                        muted
                        playsInline
                        webkit-playsinline
                      >
                        <source src={item.video} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={item.image}
                        className="h-60 w-full border-b border-black object-cover pb-2 dark:border-white/40 sm:h-[30rem]"
                        alt="item-image"
                        height={100}
                        width={100}
                      />
                    )}
                    <p className="absolute -mt-14 w-full bg-black bg-opacity-35 pb-2 pl-5 pt-2 text-xl font-extrabold capitalize text-white dark:border-white sm:text-2xl">
                      {item.name}
                    </p>
                    <p className="mb-9 mt-3 text-sm sm:mb-14 sm:text-base">
                      {item.address}
                    </p>
                    <div className="absolute bottom-0 flex w-full flex-col gap-2">
                      <div className="flex items-center justify-between font-extrabold">
                        {item.reviews > 0 ? (
                          <p className="">
                            {item.reviews}{" "}
                            <span className="text-sm font-normal">
                              {" "}
                              Reviews
                            </span>
                          </p>
                        ) : (
                          ""
                        )}
                        {item.rating > 0 ? (
                          <p className="px-4 sm:py-2">⭐ {item.rating}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-20 text-center text-black/50 dark:text-white/70">
              No restaurant found
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default RestaurantsPage;
