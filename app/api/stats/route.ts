import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Service } from "@/lib/models/Service";
import { Booking } from "@/lib/models/Booking";
import { Store } from "@/lib/models/Store";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  const [productCount, serviceCount, storeCount, bookingCount] = await Promise.all([
    Product.countDocuments(),
    Service.countDocuments(),
    Store.countDocuments(),
    uid ? Booking.countDocuments({ userId: uid }) : Promise.resolve(0),
  ]);

  return NextResponse.json({
    products: productCount,
    services: serviceCount,
    stores: storeCount,
    bookings: bookingCount,
  });
}
