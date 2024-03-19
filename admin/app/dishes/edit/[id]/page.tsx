import supabase from "@/utils/supabase";
import Dish from "./edit";

const EditDishPage = ({ params }: { params: { id: string } }) => {
  return <Dish paramsData={params}></Dish>;
};

export default EditDishPage;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("dishes").select("id");

  if (error) {
    console.error("Error fetching dish IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ id: data[i].id.toString() });
  }

  return pagesParams;
}
