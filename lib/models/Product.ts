import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image: string;
  storeId?: mongoose.Types.ObjectId;
  serviceName?: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.0 },
    type: { type: String, enum: ["item", "service"], default: "item" },
    image: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    serviceName: { type: String },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
