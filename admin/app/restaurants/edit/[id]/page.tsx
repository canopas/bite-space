import Restaurant from "./edit";

const EditRestaurantPage = ({ params }: { params: { id: number } }) => {
  return <Restaurant paramsData={params}></Restaurant>;
};

export default EditRestaurantPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
