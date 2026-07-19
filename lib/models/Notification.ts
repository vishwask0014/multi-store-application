import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "order_confirmed" | "order_cancelled" | "booking_confirmed" | "booking_cancelled" | "new_order" | "new_booking" | "low_inventory" | "order_status";
  title: string;
  message: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["order_confirmed", "order_cancelled", "booking_confirmed", "booking_cancelled", "new_order", "new_booking", "low_inventory", "order_status"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
