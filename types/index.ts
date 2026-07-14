declare global {
  var mongoose: { conn: any; promise: any };
}

export interface ProductData {
  id: string;
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image: string;
  storeId?: string;
  serviceName?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  type: "item" | "service";
  image: string;
}

export interface BookingItem {
  id: string;
  title: string;
  price: number;
  date: string;
  time: string;
  image: string;
}

export interface StoreData {
  id: string;
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  storeId?: string;
  productCount: number;
  products: ProductData[];
}
