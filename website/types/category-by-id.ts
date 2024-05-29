export type CategoryData = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type RestaurantData = {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  menu: CategoryData;
  dishes: [];
};
