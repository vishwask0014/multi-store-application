import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  storeId?: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  title: string;
  price: number;
  date: string;
  time: string;
  image: string;
  duration?: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected" | "rescheduled";
  timeline: { status: string; timestamp: Date; note?: string }[];
  rescheduleRequest?: {
    newDate: string;
    newTime: string;
    requestedAt: Date;
  };
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  customerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, default: "" },
    duration: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected", "rescheduled"],
      default: "pending",
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    rescheduleRequest: {
      newDate: String,
      newTime: String,
      requestedAt: Date,
    },
    cancelledAt: Date,
    cancelledBy: String,
    cancellationReason: String,
    customerNotes: String,
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ storeId: 1, status: 1 });

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
