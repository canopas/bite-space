import Category from "./edit";

const EditCategoryPage = ({ params }: { params: { id: number } }) => {
  return <Category paramsData={params}></Category>;
};

export default EditCategoryPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
