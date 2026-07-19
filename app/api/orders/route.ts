import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/services/order";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;
    const storeId = url.searchParams.get("storeId") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const result = await getOrders({ userId, storeId, status, page, limit });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    const status = err.message.includes("not found") || err.message.includes("Insufficient") || err.message.includes("at least one") || err.message.includes("negative") ? 400 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
