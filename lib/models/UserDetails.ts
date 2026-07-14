import mongoose, { Schema, Document } from "mongoose";

export interface IUserDetails extends Document {
  userId: mongoose.Types.ObjectId;
  uid: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  businessCategory: string;
  gstNumber?: string;
  businessRegNumber?: string;
  aadharNumber?: string;
  panNumber?: string;
  ownerPhoto?: string;
  storeName: string;
  storeDescription?: string;
  storeImages: string[];
  storeAddress?: string;
  storeCity?: string;
  storeCoverage?: number;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDetailsSchema = new Schema<IUserDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    uid: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessCategory: { type: String, required: true },
    gstNumber: { type: String },
    businessRegNumber: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
    ownerPhoto: { type: String },
    storeName: { type: String, required: true },
    storeDescription: { type: String },
    storeImages: [{ type: String }],
    storeAddress: { type: String },
    storeCity: { type: String },
    storeCoverage: { type: Number },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "draft",
    },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const UserDetails =
  mongoose.models.UserDetails ||
  mongoose.model<IUserDetails>("UserDetails", UserDetailsSchema);
