import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Store } from "@/lib/models/Store";

export async function GET() {
  await connectDB();
  const stores = await Store.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(stores);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const store = await Store.create(body);
  return NextResponse.json(store, { status: 201 });
}
