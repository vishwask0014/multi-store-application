import { NextResponse } from "next/server";
import { getStoreById, updateStore, softDeleteStore, restoreStore, hardDeleteStore } from "@/lib/services/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const store = await updateStore(id, body);
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
  return NextResponse.json(store);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const permanent = url.searchParams.get("permanent") === "true";

  const store = permanent ? await hardDeleteStore(id) : await softDeleteStore(id);
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });
  return NextResponse.json({ success: true, deleted: true });
}
