import supabase from "@/utils/supabase";
import Category from "./category";

const FoodCategoryRestaurants = ({
  params,
}: {
  params: { category: string };
}) => {
  return <Category paramsData={params}></Category>;
};

export default FoodCategoryRestaurants;

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("restaurant_id", 0);

  if (error) {
    console.error("Error fetching category IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ category: data[i].id.toString() });
  }

  return pagesParams;
}
