import ScrollUp from "@/components/Common/ScrollUp";
import FoodCategory from "@/components/FoodCategory";
import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import YouMayLike from "@/components/YouMayLike";
import { Inter } from "@next/font/google";
import RootLayout from "../components/Layout/root";
import withScrollRestoration from "@/components/withScrollRestoration";
import supabase from "@/utils/supabase";
import {
  getFoodCategories,
  getItemCardData,
  getYouMayLikeData,
} from "@/store/category/slice";

const inter = Inter({ subsets: ["latin"] });

function Home({
  foodCategoryData,
  itemCardData,
  youMayLikeData,
}: {
  foodCategoryData: any;
  itemCardData: any;
  youMayLikeData: any;
}) {
  return (
    <>
      <RootLayout manageHeaderColor={true}>
        <ScrollUp />
        <Hero />
        <FoodCategory categories={foodCategoryData} />
        <ItemCard items={itemCardData} />
        <YouMayLike restaurants={youMayLikeData} />
      </RootLayout>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;

  if (req.url != "/") {
    return {
      props: {
        foodCategoryData: [],
        itemCardData: [],
        youMayLikeData: [],
      },
    };
  }

  const fetchFoodCategories = async () => {
    try {
      const { data, error } = await getFoodCategories();
      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const foodCategoryData = await fetchFoodCategories();

  const fetchItemCardData = async () => {
    try {
      // Fetch menu IDs associated with public restaurants
      const { data, error } = await getItemCardData();
      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const itemCardData = await fetchItemCardData();

  const fetchYouMayLikeData = async () => {
    try {
      const { data, error } = await getYouMayLikeData();
      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error while fetching restaurants data: ", error);
      return [];
    }
  };

  const youMayLikeData = await fetchYouMayLikeData();

  // Return data as props
  return {
    props: {
      foodCategoryData,
      itemCardData,
      youMayLikeData,
    },
  };
}

export default withScrollRestoration(Home);
