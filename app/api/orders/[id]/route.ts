import { NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/services/order";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, actorId, actorRole, reason } = body;

    if (!status || !actorId || !actorRole) {
      return NextResponse.json(
        { error: "status, actorId, and actorRole are required" },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(id, status, actorId, actorRole, reason);
    return NextResponse.json(order);
  } catch (err: any) {
    const status = err.message.includes("not found") ? 404 :
      err.message.includes("Cannot transition") || err.message.includes("can only") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
