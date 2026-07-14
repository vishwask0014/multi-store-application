import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";

export async function GET() {
  await connectDB();
  const services = await Service.find().populate("products").sort({ createdAt: -1 }).lean();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const service = await Service.create(body);
  return NextResponse.json(service, { status: 201 });
}
