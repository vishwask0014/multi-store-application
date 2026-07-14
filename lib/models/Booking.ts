import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  title: string;
  price: number;
  date: string;
  time: string;
  image: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
