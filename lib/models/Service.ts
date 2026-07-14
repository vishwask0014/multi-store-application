import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  storeId?: mongoose.Types.ObjectId;
  productCount: number;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.0 },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    productCount: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const Service =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
