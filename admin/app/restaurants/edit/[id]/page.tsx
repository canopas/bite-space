import supabase from "@/utils/supabase";
import Restaurant from "./edit";

const EditRestaurantPage = ({ params }: { params: { id: string } }) => {
  return <Restaurant paramsData={params}></Restaurant>;
};

export default EditRestaurantPage;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("restaurants").select("id");

  if (error) {
    console.error("Error fetching restaurant IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ id: data[i].id.toString() });
  }

  return pagesParams;
}
