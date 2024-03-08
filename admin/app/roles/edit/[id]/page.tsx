import Role from "./edit";

const EditRolePage = ({ params }: { params: { id: number } }) => {
  return <Role paramsData={params}></Role>;
};

export default EditRolePage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
