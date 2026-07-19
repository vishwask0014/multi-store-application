import { connectDB } from "@/lib/mongodb";
import { Booking, IBooking } from "@/lib/models/Booking";
import mongoose from "mongoose";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled", "rejected"],
  confirmed: ["completed", "cancelled", "rescheduled"],
  rescheduled: ["confirmed", "cancelled", "rejected"],
  completed: [],
  cancelled: [],
  rejected: [],
};

export interface BookingsQuery {
  userId?: string;
  storeId?: string;
  serviceId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookingInput {
  userId: string;
  storeId?: string;
  serviceId?: string;
  title: string;
  price: number;
  date: string;
  time: string;
  image?: string;
  duration?: number;
  customerNotes?: string;
}

export async function getBookings(query: BookingsQuery) {
  await connectDB();
  const { userId, storeId, serviceId, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (userId) filter.userId = userId;
  if (storeId) filter.storeId = new mongoose.Types.ObjectId(storeId);
  if (serviceId) filter.serviceId = new mongoose.Types.ObjectId(serviceId);
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("storeId", "name slug")
      .populate("serviceId", "title image")
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getBookingById(id: string) {
  await connectDB();
  return Booking.findById(id)
    .populate("storeId", "name slug")
    .populate("serviceId", "title image duration price")
    .lean();
}

export async function createBooking(input: CreateBookingInput) {
  await connectDB();
  const booking = await Booking.create({
    ...input,
    timeline: [{ status: "pending", timestamp: new Date() }],
  });
  return booking.toObject();
}

export async function updateBookingStatus(
  id: string,
  newStatus: string,
  actorId: string,
  actorRole: "customer" | "owner",
  reason?: string
) {
  await connectDB();
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");

  const allowed = VALID_TRANSITIONS[booking.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
  }

  if (actorRole === "customer" && newStatus !== "cancelled") {
    throw new Error("Customers can only cancel bookings");
  }
  if (actorRole === "customer" && !["pending", "confirmed"].includes(booking.status)) {
    throw new Error("Can only cancel pending or confirmed bookings");
  }

  const update: Record<string, any> = {
    status: newStatus,
    $push: { timeline: { status: newStatus, timestamp: new Date(), note: reason || "" } },
  };

  if (newStatus === "cancelled") {
    update.cancelledAt = new Date();
    update.cancelledBy = actorId;
    update.cancellationReason = reason || "";
  }

  return Booking.findByIdAndUpdate(id, update, { new: true })
    .populate("storeId", "name slug")
    .populate("serviceId", "title image duration price")
    .lean();
}

export async function requestReschedule(
  id: string,
  newDate: string,
  newTime: string
) {
  await connectDB();
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "confirmed") {
    throw new Error("Can only reschedule confirmed bookings");
  }

  return Booking.findByIdAndUpdate(
    id,
    {
      status: "rescheduled",
      rescheduleRequest: { newDate, newTime, requestedAt: new Date() },
      $push: {
        timeline: {
          status: "rescheduled",
          timestamp: new Date(),
          note: `Reschedule requested to ${newDate} at ${newTime}`,
        },
      },
    },
    { new: true }
  )
    .populate("storeId", "name slug")
    .populate("serviceId", "title image duration price")
    .lean();
}

export async function acceptReschedule(id: string) {
  await connectDB();
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "rescheduled" || !booking.rescheduleRequest) {
    throw new Error("No pending reschedule request");
  }

  return Booking.findByIdAndUpdate(
    id,
    {
      status: "confirmed",
      date: booking.rescheduleRequest.newDate,
      time: booking.rescheduleRequest.newTime,
      rescheduleRequest: undefined,
      $push: {
        timeline: {
          status: "confirmed",
          timestamp: new Date(),
          note: "Reschedule accepted",
        },
      },
    },
    { new: true }
  )
    .populate("storeId", "name slug")
    .populate("serviceId", "title image duration price")
    .lean();
}

export async function rejectReschedule(id: string) {
  await connectDB();
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "rescheduled") {
    throw new Error("No pending reschedule request");
  }

  return Booking.findByIdAndUpdate(
    id,
    {
      status: "confirmed",
      rescheduleRequest: undefined,
      $push: {
        timeline: {
          status: "confirmed",
          timestamp: new Date(),
          note: "Reschedule rejected",
        },
      },
    },
    { new: true }
  )
    .populate("storeId", "name slug")
    .populate("serviceId", "title image duration price")
    .lean();
}
