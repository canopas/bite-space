import supabase from "@/utils/supabase";
import Menu from "./edit";

const EditMenuPage = ({ params }: { params: { id: string } }) => {
  return <Menu paramsData={params}></Menu>;
};

export default EditMenuPage;

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("menus")
    .select("id");

  if (error) {
    console.error("Error fetching menu IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ id: data[i].id.toString() });
  }

  return pagesParams;
}
