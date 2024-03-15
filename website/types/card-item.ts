export type ItemProps = {
  id: number;
  name: string;
  tags?: string[];
  image: string;
  video?: string;
  price: number;
  rating: number;
  restaurants: {
    name: string;
    address: string;
  };
};
