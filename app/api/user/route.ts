import { NextResponse } from "next/server";
import { findUserByUid, upsertUser, updateProfile, applyForOwnership } from "@/lib/services/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const user = await findUserByUid(uid);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { uid, phone, name } = body;

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const user = await upsertUser(uid, phone || "", name);
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const body = await req.json();

  if (body.name !== undefined) {
    const user = await updateProfile(uid, { name: body.name });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  }

  if (body.action === "apply-owner") {
    const { businessName, businessAddress, businessCategory, gstNumber, businessRegNumber, aadharNumber, panNumber } = body;

    if (!businessName || !businessAddress || !businessCategory) {
      return NextResponse.json(
        { error: "businessName, businessAddress, and businessCategory are required" },
        { status: 400 }
      );
    }

    const user = await applyForOwnership(uid, {
      businessName,
      businessAddress,
      businessCategory,
      gstNumber,
      businessRegNumber,
      aadharNumber,
      panNumber,
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
