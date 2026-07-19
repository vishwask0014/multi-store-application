import mongoose, { Schema, Document } from "mongoose";

export interface IProductVariant {
  name: string;
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface IProduct extends Document {
  title: string;
  price: number;
  discountPrice?: number;
  rating: number;
  type: "item" | "service";
  image: string;
  gallery: string[];
  description: string;
  storeId?: mongoose.Types.ObjectId;
  serviceName?: string;
  sku: string;
  inventory: number;
  category: string;
  tags: string[];
  featured: boolean;
  deletedAt?: Date;
  variants: IProductVariant[];
  createdAt: Date;
}

const VariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    price: { type: Number },
    stock: { type: Number },
    sku: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    rating: { type: Number, default: 4.0 },
    type: { type: String, enum: ["item", "service"], default: "item" },
    image: { type: String, default: "" },
    gallery: [{ type: String }],
    description: { type: String, default: "" },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    serviceName: { type: String },
    sku: { type: String, default: "" },
    inventory: { type: Number, default: 0 },
    category: { type: String, default: "" },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    deletedAt: { type: Date },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, featured: 1, deletedAt: 1 });
ProductSchema.index({ storeId: 1, deletedAt: 1 });
ProductSchema.index({ price: 1 });

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
