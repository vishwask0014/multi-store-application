import mongoose, { Schema, Document } from "mongoose";

export interface IStore extends Document {
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
  description?: string;
  address?: string;
  city?: string;
  coverage?: number;
  ownerUid?: string;
  createdAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    tag: { type: String, enum: ["Fulfilled", "Filled"], default: "Fulfilled" },
    offeringCount: { type: Number, default: 0 },
    images: [{ type: String }],
    description: { type: String },
    address: { type: String },
    city: { type: String },
    coverage: { type: Number },
    ownerUid: { type: String },
  },
  { timestamps: true }
);

export const Store =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
