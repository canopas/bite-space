import Restaurant from "./restaurant";
import cuisineData from "@/components/Cuisines/cuisinesData";

const RestaurantMenuDetails = ({
  params,
}: {
  params: { restaurant: string };
}) => {
  return <Restaurant paramsData={params}></Restaurant>;
};

export default RestaurantMenuDetails;

export async function generateStaticParams() {
  const data = cuisineData;

  const pagesParams: any[] = [];
  for (var i = 0; i < data.length; i++) {
    pagesParams.push({
      restaurant: data[i].name.replace(/\s+/g, "-").toLocaleLowerCase(),
    });
  }

  return pagesParams;
}
