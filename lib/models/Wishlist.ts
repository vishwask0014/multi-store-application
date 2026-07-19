import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistItem {
  targetType: "product" | "service" | "store";
  targetId: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    targetType: {
      type: String,
      enum: ["product", "service", "store"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true },
    items: [WishlistItemSchema],
  },
  { timestamps: true }
);

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
