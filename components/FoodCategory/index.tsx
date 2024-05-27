"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { InView } from "react-intersection-observer";

import "swiper/css";
import "swiper/css/navigation";

import SectionTitle from "../Common/SectionTitle";
import CategorySwiperSkeleton from "../SkeletonPlaceholders/CategorySwiper";
import SingleItem from "./SingleItem";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCategoriesState } from "@/store/home/slice";
import { getFoodCategories } from "@/store/category/slice";

const FoodCategory = ({ categories }: { categories: any }) => {
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.home.categories);
  const isPageReset = useAppSelector((state) => state.app.isPageReset);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(
    categories ? false : true
  );
  const [categoriesData, setCategoriesData] = useState<any | null>(categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await getFoodCategories();
        if (error) throw error;

        dispatch(setCategoriesState(data));
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    if (!categories) {
      if (categoriesState.length == 0) {
        fetchCategories();
      } else {
        setCategoriesData(categoriesState);
        setIsCategoriesLoading(false);
      }
    }
  }, [dispatch, categories, categoriesState, categoriesState.length]);

  return (
    <>
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container animated-fade mb-20">
          <SectionTitle
            title="What's on your mind?"
            paragraph="We believe in the power of expression – so go ahead, let your thoughts flow."
            customClass="mx-auto text-center mb-12 xl:mb-28 mt-20"
          />

          {isCategoriesLoading ? (
            <CategorySwiperSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
                {categoriesData.map((item: any, index: any) => (
                  <div key={"item-card-" + index}>
                    <InView
                      triggerOnce
                      className={`${!isPageReset ? "animated-fade-y" : ""}`}
                    >
                      {({ inView, ref, entry }) => (
                        <Link
                          ref={ref}
                          href={
                            "/category/" +
                            encodeURIComponent(
                              item.name.toLowerCase().replace(/\s+/g, "-")
                            ) +
                            "-" +
                            btoa(item.id.toString())
                          }
                          className={`h-full w-full ${
                            inView
                              ? !isPageReset
                                ? "animated-fade-y"
                                : ""
                              : ""
                          }`}
                        >
                          <SingleItem item={item} />
                        </Link>
                      )}
                    </InView>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default FoodCategory;
