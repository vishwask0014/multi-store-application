import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot {
  start: string;
  end: string;
}

export interface IService extends Document {
  title: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  gallery: string[];
  storeId?: mongoose.Types.ObjectId;
  productCount: number;
  products: mongoose.Types.ObjectId[];
  duration: number;
  maxBookings: number;
  bufferTime: number;
  workingDays: string[];
  categories: string[];
  featured: boolean;
  deletedAt?: Date;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    gallery: [{ type: String }],
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    productCount: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    duration: { type: Number, default: 60 },
    maxBookings: { type: Number, default: 10 },
    bufferTime: { type: Number, default: 15 },
    workingDays: [{ type: String }],
    categories: [{ type: String }],
    featured: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ServiceSchema.index({ title: "text", description: "text" });
ServiceSchema.index({ categories: 1, featured: 1, deletedAt: 1 });
ServiceSchema.index({ storeId: 1, deletedAt: 1 });

export const Service =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
