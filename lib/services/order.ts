import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import mongoose from "mongoose";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export interface OrdersQuery {
  userId?: string;
  storeId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderInput {
  userId: string;
  storeId: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    sku?: string;
    variant?: { name: string; value: string; price?: number; sku?: string };
  }[];
  discount?: number;
  tax?: number;
  deliveryCharges?: number;
  paymentMethod?: "cod" | "online";
}

export async function getOrders(query: OrdersQuery) {
  await connectDB();
  const { userId, storeId, status, page = 1, limit = 20 } = query;
  const filter: Record<string, any> = {};

  if (userId) filter.userId = new mongoose.Types.ObjectId(userId);
  if (storeId) filter.storeId = new mongoose.Types.ObjectId(storeId);
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name phone")
      .populate("storeId", "name")
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOrderById(id: string) {
  await connectDB();
  return Order.findById(id)
    .populate("userId", "name phone")
    .populate("storeId", "name slug")
    .lean();
}

export async function createOrder(input: CreateOrderInput) {
  await connectDB();

  const { userId, storeId, items, discount = 0, tax = 0, deliveryCharges = 0, paymentMethod = "cod" } = input;

  if (!items || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal - discount + tax + deliveryCharges;

  if (totalAmount < 0) {
    throw new Error("Total amount cannot be negative");
  }

  // Decrement inventory for each item
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product ${item.title} not found`);
    }
    if (product.deletedAt) {
      throw new Error(`Product ${item.title} is no longer available`);
    }
    const available = product.inventory ?? -1;
    if (available !== -1 && available < item.quantity) {
      throw new Error(`Insufficient stock for ${item.title}. Available: ${available}, Requested: ${item.quantity}`);
    }
    if (available !== -1) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { inventory: -item.quantity },
      });
    }
  }

  const order = await Order.create({
    userId: new mongoose.Types.ObjectId(userId),
    storeId: new mongoose.Types.ObjectId(storeId),
    items,
    subtotal,
    discount,
    tax,
    deliveryCharges,
    totalAmount,
    paymentMethod,
    timeline: [{ status: "pending", timestamp: new Date() }],
  });

  return order.populate(["userId", "storeId"]);
}

export async function updateOrderStatus(
  id: string,
  newStatus: string,
  actorId: string,
  actorRole: "customer" | "owner",
  reason?: string
) {
  await connectDB();

  const order = await Order.findById(id);
  if (!order) {
    throw new Error("Order not found");
  }

  const currentStatus = order.status;
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed || !allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${currentStatus} to ${newStatus}`);
  }

  // Customers can only cancel before confirmation
  if (actorRole === "customer" && newStatus !== "cancelled") {
    throw new Error("Customers can only cancel orders");
  }
  if (actorRole === "customer" && currentStatus !== "pending") {
    throw new Error("Can only cancel orders that are pending");
  }

  const update: Record<string, any> = {
    status: newStatus,
    $push: {
      timeline: {
        status: newStatus,
        timestamp: new Date(),
        note: reason || "",
      },
    },
  };

  if (newStatus === "cancelled") {
    update.cancelledAt = new Date();
    update.cancelledBy = actorId;
    update.cancellationReason = reason || "";

    // Restore inventory
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product && (product.inventory ?? -1) !== -1) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventory: item.quantity },
        });
      }
    }
  }

  return Order.findByIdAndUpdate(id, update, { new: true })
    .populate("userId", "name phone")
    .populate("storeId", "name slug")
    .lean();
}
