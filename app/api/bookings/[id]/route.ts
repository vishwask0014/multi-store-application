import { NextResponse } from "next/server";
import { getBookingById, updateBookingStatus, requestReschedule, acceptReschedule, rejectReschedule } from "@/lib/services/booking";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, status, actorId, actorRole, reason, newDate, newTime } = body;

    if (action === "reschedule") {
      if (!newDate || !newTime) {
        return NextResponse.json({ error: "newDate and newTime are required for reschedule" }, { status: 400 });
      }
      const booking = await requestReschedule(id, newDate, newTime);
      return NextResponse.json(booking);
    }

    if (action === "accept-reschedule") {
      const booking = await acceptReschedule(id);
      return NextResponse.json(booking);
    }

    if (action === "reject-reschedule") {
      const booking = await rejectReschedule(id);
      return NextResponse.json(booking);
    }

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const booking = await updateBookingStatus(id, status, actorId || "", actorRole || "owner", reason);
    return NextResponse.json(booking);
  } catch (err: any) {
    const status = err.message.includes("not found") ? 404 :
      err.message.includes("Cannot transition") || err.message.includes("can only") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
