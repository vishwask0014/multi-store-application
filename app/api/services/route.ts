import { NextResponse } from "next/server";
import { getServices, createService } from "@/lib/services/service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = {
    search: url.searchParams.get("search") || undefined,
    category: url.searchParams.get("category") || undefined,
    storeId: url.searchParams.get("storeId") || undefined,
    featured: url.searchParams.get("featured") === "true" || undefined,
    minPrice: url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined,
    maxPrice: url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined,
    page: url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 20,
    sort: url.searchParams.get("sort") || "-createdAt",
  };

  const result = await getServices(query);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const service = await createService(body);
  return NextResponse.json(service, { status: 201 });
}
