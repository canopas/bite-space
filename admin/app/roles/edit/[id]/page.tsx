import supabase from "@/utils/supabase";
import Role from "./edit";

const EditRolePage = ({ params }: { params: { id: string } }) => {
  return <Role paramsData={params}></Role>;
};

export default EditRolePage;

export async function generateStaticParams() {
  const { data, error } = await supabase.from("roles").select("id");

  if (error) {
    console.error("Error fetching roles IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ id: data[i].id.toString() });
  }

  return pagesParams;
}
