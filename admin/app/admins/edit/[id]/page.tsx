import Admin from "./edit";

const EditAdminPage = ({ params }: { params: { id: number } }) => {
  return <Admin paramsData={params}></Admin>;
};

export default EditAdminPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
