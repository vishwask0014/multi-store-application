import { NextResponse } from "next/server";
import { getStores, createStore } from "@/lib/services/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = {
    search: url.searchParams.get("search") || undefined,
    ownerUid: url.searchParams.get("ownerUid") || undefined,
    category: url.searchParams.get("category") || undefined,
    status: url.searchParams.get("status") || undefined,
    page: url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 20,
  };

  const result = await getStores(query);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const store = await createStore(body);
  return NextResponse.json(store, { status: 201 });
}
