import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const filter = userId ? { userId } : {};
  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const booking = await Booking.create(body);
  return NextResponse.json(booking, { status: 201 });
}
