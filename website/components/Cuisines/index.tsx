"use client";

import Link from "next/link";
import SectionTitle from "../Common/SectionTitle";
import cuisineData from "./cuisinesData";

const Cuisines = () => {
  return (
    <>
      <section className="py-10 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="Cuisine Restaurants"
            paragraph="Savor the Symphony of Flavors: Where Culinary Excellence Meets Extraordinary Ambiance."
            customClass="mx-auto text-center mb-28 mt-20"
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cuisineData.map((item) => (
              <Link
                href={
                  "/restaurants/" +
                  item.name.replace(/\s+/g, "-").toLocaleLowerCase()
                }
                key={"cuisine-" + item.id}
                className="cursor-pointer rounded-xl border p-5 text-center hover:border-primary/10 hover:bg-primary hover:bg-opacity-10"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cuisines;
