import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "CUSTOMER" | "OWNER";
export type OwnerStatus = "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "SUSPENDED";

export interface IUser extends Document {
  uid: string;
  phone: string;
  name?: string;
  role: UserRole;
  ownerStatus: OwnerStatus;
  status: AccountStatus;
  businessName?: string;
  businessAddress?: string;
  businessCategory?: string;
  gstNumber?: string;
  businessRegNumber?: string;
  aadharNumber?: string;
  panNumber?: string;
  appliedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["CUSTOMER", "OWNER"],
      default: "CUSTOMER",
    },
    ownerStatus: {
      type: String,
      enum: ["NONE", "PENDING", "VERIFIED", "REJECTED"],
      default: "NONE",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    businessName: { type: String },
    businessAddress: { type: String },
    businessCategory: { type: String },
    gstNumber: { type: String },
    businessRegNumber: { type: String },
    aadharNumber: { type: String },
    panNumber: { type: String },
    appliedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
