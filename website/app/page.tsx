import ScrollUp from "@/components/Common/ScrollUp";
import Cuisines from "@/components/Cuisines";
import FoodCategory from "@/components/FoodCategory";
import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import YouMayLike from "@/components/YouMayLike";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <FoodCategory />
      <ItemCard />
      <YouMayLike />
      <Cuisines />
    </>
  );
}
