import supabase from "@/utils/supabase";
import Menu from "./menu";

const RestaurantMenuDetails = ({
  params,
}: {
  params: { restaurant: string };
}) => {
  return <Menu paramsData={params}></Menu>;
};

export default RestaurantMenuDetails;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("restaurants").select("id");
  if (error) {
    console.error("Error fetching restaurant IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ restaurant: data[i].id.toString() });
  }

  return pagesParams;
}
