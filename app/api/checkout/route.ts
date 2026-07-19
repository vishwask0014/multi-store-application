import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Booking } from "@/lib/models/Booking";
import { Product } from "@/lib/models/Product";
import { Store } from "@/lib/models/Store";
import { Service } from "@/lib/models/Service";
import mongoose from "mongoose";
import { createNotification } from "@/lib/services/notification";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, mongoUserId, items, bookings, paymentMethod = "cod" } = body;

    if (!mongoUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    if ((!items || items.length === 0) && (!bookings || bookings.length === 0)) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const createdOrders: any[] = [];
    const createdBookings: any[] = [];

    // Process product items -> group by store -> create orders
    if (items && items.length > 0) {
      const storeGroups: Record<string, any[]> = {};

      for (const item of items) {
        const product = await Product.findById(item.id).populate("storeId", "ownerUid name").lean();
        if (!product) {
          return NextResponse.json({ error: `Product ${item.title} not found` }, { status: 400 });
        }
        if (product.deletedAt) {
          return NextResponse.json({ error: `${item.title} is no longer available` }, { status: 400 });
        }

        const available = product.inventory ?? -1;
        if (available !== -1 && available < item.quantity) {
          return NextResponse.json({
            error: `Insufficient stock for ${item.title}. Available: ${available}, Requested: ${item.quantity}`,
          }, { status: 400 });
        }

        const storeId = product.storeId?._id?.toString() || product.storeId?.toString();
        if (!storeId) continue;

        if (!storeGroups[storeId]) storeGroups[storeId] = [];
        storeGroups[storeId].push({
          productId: product._id,
          title: product.title,
          price: product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price,
          quantity: item.quantity,
          image: product.image || "",
          sku: product.sku,
        });

        // Decrement inventory
        if (available !== -1) {
          await Product.findByIdAndUpdate(product._id, { $inc: { inventory: -item.quantity } });
        }
      }

      // Create one order per store
      for (const [storeId, storeItems] of Object.entries(storeGroups)) {
        const subtotal = storeItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
        const totalAmount = subtotal;

        const order = await Order.create({
          userId: new mongoose.Types.ObjectId(mongoUserId),
          storeId: new mongoose.Types.ObjectId(storeId),
          items: storeItems,
          subtotal,
          totalAmount,
          paymentMethod,
          timeline: [{ status: "pending", timestamp: new Date() }],
        });

        const populated = await order.populate(["userId", "storeId"]);

        // Notify owner
        const store = await Store.findById(storeId).lean();
        if (store?.ownerUid) {
          await createNotification({
            userId: store.ownerUid,
            type: "new_order",
            title: "New Order Received",
            message: `Order ${order.orderNumber} placed at ${store.name}`,
            data: { orderId: order._id.toString(), orderNumber: order.orderNumber },
          });
        }

        createdOrders.push(populated);
      }
    }

    // Process bookings
    if (bookings && bookings.length > 0) {
      for (const b of bookings) {
        const service = await Service.findById(b.id).populate("storeId", "ownerUid name").lean() as any;
        if (!service) {
          return NextResponse.json({ error: `Service ${b.title} not found` }, { status: 400 });
        }

        const booking = await Booking.create({
          userId,
          storeId: service.storeId?._id || service.storeId,
          serviceId: service._id,
          title: b.title,
          price: b.price,
          date: b.date,
          time: b.time,
          image: b.image || service.image || "",
          duration: service.duration,
          status: "pending",
          timeline: [{ status: "pending", timestamp: new Date() }],
        });

        // Notify owner
        if (service.storeId?.ownerUid) {
          await createNotification({
            userId: service.storeId.ownerUid,
            type: "new_booking",
            title: "New Booking Request",
            message: `New booking for ${b.title} on ${b.date} at ${b.time}`,
            data: { bookingId: booking._id.toString() },
          });
        }

        createdBookings.push(booking.toObject());
      }
    }

    return NextResponse.json({
      orders: createdOrders.map((o) => ({ id: o._id.toString(), orderNumber: o.orderNumber })),
      bookings: createdBookings.map((b) => ({ id: b._id.toString(), title: b.title, date: b.date, time: b.time })),
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
