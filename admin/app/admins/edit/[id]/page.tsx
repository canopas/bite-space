import supabase from "@/utils/supabase";
import Admin from "./edit";

const EditAdminPage = ({ params }: { params: { id: string } }) => {
  return <Admin paramsData={params}></Admin>;
};

export default EditAdminPage;

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .neq("role", "super-admin");

  if (error) {
    console.error("Error fetching admin IDs:", error);
    return [];
  }

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({ id: data[i].id.toString() });
  }

  return pagesParams;
}
