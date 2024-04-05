export type ItemProps = {
  id: number;
  name: string;
  description: string;
  tags?: string[];
  image: string;
  video?: string;
  price: number;
  rating: number;
  menus: {
    id: number,
    restaurants: {
      name: string;
      address: string;
    };
  };
};
