export interface ProductData {
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image: string;
  serviceName?: string;
}

export interface StoreData {
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
}

export interface ServiceData {
  title: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  productCount: number;
  products: ProductData[];
}
