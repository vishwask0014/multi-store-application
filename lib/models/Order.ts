import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
    image: string;
    sku?: string;
    variant?: { name: string; value: string; price?: number; sku?: string };
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  paymentMethod: "cod" | "online";
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  timeline: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${result}`;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, default: generateOrderNumber },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: "" },
        sku: String,
        variant: {
          name: String,
          value: String,
          price: Number,
          sku: String,
        },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    cancelledAt: Date,
    cancelledBy: String,
    cancellationReason: String,
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ storeId: 1, status: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ createdAt: -1 });

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
