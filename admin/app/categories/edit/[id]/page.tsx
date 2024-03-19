import supabase from "@/utils/supabase";
import Category from "./edit";

const EditCategoryPage = ({ params }: { params: { id: string } }) => {
  return <Category paramsData={params}></Category>;
};

export default EditCategoryPage;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("categories").select("id");

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
