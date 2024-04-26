import ScrollUp from "@/components/Common/ScrollUp";
import Cuisines from "@/components/Cuisines";
import FoodCategory from "@/components/FoodCategory";
import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import YouMayLike from "@/components/YouMayLike";
import { Inter } from "@next/font/google";
import RootLayout from "../components/Layout/layout";
import withScrollRestoration from "@/components/withScrollRestoration";

const inter = Inter({ subsets: ["latin"] });

function Home() {
  return (
    <>
      <RootLayout>
        <ScrollUp />
        <Hero />
        <FoodCategory />
        <ItemCard />
        <YouMayLike />
      </RootLayout>
    </>
  );
}

export default withScrollRestoration(Home);
