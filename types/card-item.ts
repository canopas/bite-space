export type ItemProps = {
  id: number;
  name: string;
  description: string;
  tags?: string[];
  image: string;
  video?: string;
  price: number;
  rating: number;
  // `restaurants` is an object not an array, cause it's a relational object of menus data
  menus: {
    id: number,
    restaurants: {
      name: string;
      address: string;
    };
  };
};
