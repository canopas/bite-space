import ScrollUp from "@/components/Common/ScrollUp";
import Cuisines from "@/components/Cuisines";
import FoodCategory from "@/components/FoodCategory";
import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import YouMayLike from "@/components/YouMayLike";
import { Inter } from "@next/font/google";
import RootLayout from "../components/Layout/root";

const inter = Inter({ subsets: ["latin"] });

function Home() {
    return (
    <>
      <RootLayout manageHeaderColor={true}>
        <ScrollUp />
        <Hero />
        <FoodCategory />
        <ItemCard />
        <YouMayLike />
      </RootLayout>
    </>
  );
}

export default Home;
