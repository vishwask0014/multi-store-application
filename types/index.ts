declare global {
  var mongoose: { conn: any; promise: any };
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type PaymentMethod = "cod" | "online";

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  variant?: { name: string; value: string; price?: number; sku?: string };
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId: { id: string; name?: string; phone?: string } | string;
  storeId: { id: string; name?: string } | string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  timeline: OrderTimelineEntry[];
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected" | "rescheduled";

export interface BookingData {
  _id: string;
  userId: string;
  storeId?: string;
  serviceId?: string;
  title: string;
  price: number;
  date: string;
  time: string;
  image?: string;
  duration?: number;
  status: BookingStatus;
  timeline?: OrderTimelineEntry[];
  createdAt: string;
}

export interface NotificationData {
  id: string;
  userId: string;
  type: "order_confirmed" | "order_cancelled" | "booking_confirmed" | "booking_cancelled" | "new_order" | "new_booking" | "low_inventory" | "order_status";
  title: string;
  message: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface ProductVariant {
  name: string;
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface ProductData {
  id: string;
  title: string;
  price: number;
  discountPrice?: number;
  rating: number;
  type: "item" | "service";
  image: string;
  gallery?: string[];
  description?: string;
  storeId?: string;
  serviceName?: string;
  sku?: string;
  inventory?: number;
  category?: string;
  tags?: string[];
  featured?: boolean;
  deletedAt?: string | null;
  variants?: ProductVariant[];
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

export interface StoreAvailability {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  open: string;
  close: string;
  closed: boolean;
}

export interface StoreContact {
  phone?: string;
  email?: string;
}

export interface StoreSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}

export interface StoreData {
  id: string;
  name: string;
  slug?: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
  description?: string;
  address?: string;
  city?: string;
  coverage?: number;
  ownerUid?: string;
  gallery?: string[];
  categories?: string[];
  availability?: StoreAvailability[];
  logo?: string;
  banner?: string;
  status?: "open" | "closed" | "temporarily_closed";
  contact?: StoreContact;
  socialLinks?: StoreSocialLinks;
  deletedAt?: string | null;
}

export interface ReviewData {
  _id: string;
  userId: { id: string; name?: string; photo?: string } | string;
  targetType: "product" | "service" | "store";
  targetId: string;
  rating: number;
  comment: string;
  ownerReply?: { comment: string; createdAt: string };
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  targetType: "product" | "service" | "store";
  targetId: string;
  title: string;
  price?: number;
  image?: string;
  addedAt: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalBookings: number;
  totalCustomers: number;
  topProducts: { title: string; count: number; revenue: number }[];
  topServices: { title: string; count: number; revenue: number }[];
  monthlySales: { month: string; revenue: number; orders: number }[];
  lowStockProducts: { title: string; inventory: number; sku?: string }[];
  recentCustomers: { name?: string; phone?: string; orderCount: number }[];
}

export interface ServiceData {
  id: string;
  title: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  gallery?: string[];
  storeId?: string;
  productCount: number;
  products: ProductData[];
  duration?: number;
  maxBookings?: number;
  bufferTime?: number;
  workingDays?: string[];
  categories?: string[];
  featured?: boolean;
  deletedAt?: string | null;
}
