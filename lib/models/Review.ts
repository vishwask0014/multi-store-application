import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  targetType: "product" | "service" | "store";
  targetId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  ownerReply?: { comment: string; createdAt: Date };
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: {
      type: String,
      enum: ["product", "service", "store"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    ownerReply: {
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ targetType: 1, targetId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
