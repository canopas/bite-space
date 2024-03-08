import Menu from "./edit";

const EditMenuPage = ({ params }: { params: { id: number } }) => {
  return <Menu paramsData={params}></Menu>;
};

export default EditMenuPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
