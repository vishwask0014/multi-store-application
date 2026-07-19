import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { Booking } from "@/lib/models/Booking";
import { Product } from "@/lib/models/Product";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const ownerUid = url.searchParams.get("ownerUid");

    if (!ownerUid) {
      return NextResponse.json({ error: "ownerUid is required" }, { status: 400 });
    }

    const Store = mongoose.model("Store");
    const stores = await Store.find({ ownerUid, deletedAt: null }).lean();
    const storeIds = stores.map((s: any) => s._id);

    if (storeIds.length === 0) {
      return NextResponse.json({
        totalRevenue: 0, totalOrders: 0, totalBookings: 0, totalCustomers: 0,
        topProducts: [], topServices: [], monthlySales: [], lowStockProducts: [], recentCustomers: [],
      });
    }

    // Total orders and revenue
    const orderStats = await Order.aggregate([
      { $match: { storeId: { $in: storeIds }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          customers: { $addToSet: "$userId" },
        },
      },
    ]);

    // Total bookings
    const bookingCount = await Booking.countDocuments({
      storeId: { $in: storeIds },
      status: { $nin: ["cancelled", "rejected"] },
    });

    // Monthly sales
    const monthlySales = await Order.aggregate([
      { $match: { storeId: { $in: storeIds }, status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { storeId: { $in: storeIds }, status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.title",
          count: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Services from bookings
    const topServices = await Booking.aggregate([
      { $match: { storeId: { $in: storeIds }, status: { $nin: ["cancelled", "rejected"] } } },
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      storeId: { $in: storeIds },
      deletedAt: null,
      inventory: { $lte: 5, $gte: 0 },
    })
      .select("title inventory sku")
      .sort({ inventory: 1 })
      .limit(10)
      .lean();

    // Recent customers
    const recentCustomers = await Order.aggregate([
      { $match: { storeId: { $in: storeIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: "$user.name",
          phone: "$user.phone",
          orderCount: 1,
        },
      },
    ]);

    return NextResponse.json({
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalBookings: bookingCount,
      totalCustomers: orderStats[0]?.customers?.length || 0,
      topProducts: topProducts.map((p: any) => ({ title: p._id, count: p.count, revenue: p.revenue })),
      topServices: topServices.map((s: any) => ({ title: s._id, count: s.count, revenue: s.revenue })),
      monthlySales: monthlySales.map((m: any) => ({ month: m._id, revenue: m.revenue, orders: m.orders })),
      lowStockProducts: lowStockProducts.map((p: any) => ({ title: p.title, inventory: p.inventory, sku: p.sku })),
      recentCustomers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
