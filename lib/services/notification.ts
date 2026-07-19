import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { Order } from "@/lib/models/Order";
import { Booking } from "@/lib/models/Booking";

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, string>;
}

export async function createNotification(input: CreateNotificationInput) {
  await connectDB();
  return Notification.create(input);
}

export async function getNotifications(userId: string, limit = 50) {
  await connectDB();
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getUnreadCount(userId: string) {
  await connectDB();
  return Notification.countDocuments({ userId, read: false });
}

export async function markAsRead(notificationId: string) {
  await connectDB();
  return Notification.findByIdAndUpdate(notificationId, { read: true });
}

export async function markAllAsRead(userId: string) {
  await connectDB();
  return Notification.updateMany({ userId, read: false }, { read: true });
}

export async function notifyCustomerOnOrderStatus(orderId: string) {
  await connectDB();
  const order = await Order.findById(orderId).populate("userId", "uid").lean();
  if (!order || !order.userId) return;

  const uid = typeof order.userId === "object" ? (order.userId as any).uid : null;
  if (!uid) return;

  const messages: Record<string, { title: string; message: string }> = {
    confirmed: { title: "Order Confirmed", message: `Order ${order.orderNumber} has been confirmed by the store.` },
    cancelled: { title: "Order Cancelled", message: `Order ${order.orderNumber} has been cancelled.` },
    preparing: { title: "Order Preparing", message: `Your order ${order.orderNumber} is being prepared.` },
    ready: { title: "Order Ready", message: `Your order ${order.orderNumber} is ready!` },
    out_for_delivery: { title: "Order Out for Delivery", message: `Your order ${order.orderNumber} is out for delivery.` },
    delivered: { title: "Order Delivered", message: `Your order ${order.orderNumber} has been delivered. Enjoy!` },
  };

  const msg = messages[order.status];
  if (!msg) return;

  await Notification.create({
    userId: uid,
    type: order.status === "cancelled" ? "order_cancelled" : "order_status",
    title: msg.title,
    message: msg.message,
    data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });
}

export async function notifyOwnerOnNewOrder(orderId: string, ownerUid: string, storeName: string) {
  await connectDB();
  const order = await Order.findById(orderId).lean();
  if (!order) return;

  await Notification.create({
    userId: ownerUid,
    type: "new_order",
    title: "New Order Received",
    message: `New order ${order.orderNumber} placed at ${storeName}`,
    data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });
}

export async function notifyCustomerOnBookingStatus(bookingId: string) {
  await connectDB();
  const booking = await Booking.findById(bookingId).lean();
  if (!booking) return;

  const messages: Record<string, { title: string; message: string }> = {
    confirmed: { title: "Booking Confirmed", message: `Your booking for ${booking.title} on ${booking.date} has been confirmed.` },
    cancelled: { title: "Booking Cancelled", message: `Your booking for ${booking.title} has been cancelled.` },
    completed: { title: "Booking Completed", message: `Your booking for ${booking.title} is completed.` },
    rejected: { title: "Booking Rejected", message: `Your booking for ${booking.title} has been rejected.` },
  };

  const msg = messages[booking.status];
  if (!msg) return;

  const type = booking.status === "cancelled" ? "booking_cancelled" :
    booking.status === "confirmed" ? "booking_confirmed" : "order_status";

  await Notification.create({
    userId: booking.userId,
    type,
    title: msg.title,
    message: msg.message,
    data: { bookingId: booking._id.toString() },
  });
}

export async function notifyOwnerOnNewBooking(bookingId: string, ownerUid: string, storeName: string) {
  await connectDB();
  const booking = await Booking.findById(bookingId).lean();
  if (!booking) return;

  await Notification.create({
    userId: ownerUid,
    type: "new_booking",
    title: "New Booking Request",
    message: `New booking for ${booking.title} on ${booking.date} at ${booking.time}`,
    data: { bookingId: booking._id.toString() },
  });
}

export async function notifyLowInventory(ownerUid: string, productTitle: string, storeName: string, currentStock: number) {
  await connectDB();
  await Notification.create({
    userId: ownerUid,
    type: "low_inventory",
    title: "Low Inventory Warning",
    message: `${productTitle} at ${storeName} is low on stock (${currentStock} remaining).`,
    data: { productTitle, storeName },
  });
}
