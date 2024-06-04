export type CategoryData = {
  id: string;
  name: string;
  description: string;
  image: string;
  dishes: [];
};

export type RestaurantData = {
  id: number;
  name: string;
  address: string;
  local_area: string;
  city: string;
  state: string;
  postal_code: number;
  country: string;
  rating: number;
  reviews: number;
  menu: CategoryData[];
};
