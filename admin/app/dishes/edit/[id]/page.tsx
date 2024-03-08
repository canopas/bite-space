import Dish from "./edit";

const EditDishPage = ({ params }: { params: { id: number } }) => {
  return <Dish paramsData={params}></Dish>;
};

export default EditDishPage;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
