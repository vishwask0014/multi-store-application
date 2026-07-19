import { NextResponse } from "next/server";
import { getBookings, createBooking, updateBookingStatus, requestReschedule } from "@/lib/services/booking";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;
    const storeId = url.searchParams.get("storeId") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const result = await getBookings({ userId, storeId, status, page, limit });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = await createBooking(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, actorId, actorRole, reason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const booking = await updateBookingStatus(id, status, actorId || "", actorRole || "owner", reason);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (err: any) {
    const status = err.message.includes("not found") ? 404 :
      err.message.includes("Cannot transition") || err.message.includes("can only") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
