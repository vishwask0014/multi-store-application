import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserDetails } from "@/lib/models/UserDetails";
import { User } from "@/lib/models/User";
import { Store } from "@/lib/models/Store";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const doc = await UserDetails.findOne({ uid }).lean();
  if (!doc) {
    return NextResponse.json(null);
  }

  return NextResponse.json({ ...doc, id: doc._id.toString() });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { uid } = body;

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const existing = await UserDetails.findOne({ uid });
  if (existing) {
    return NextResponse.json(
      { error: "User details already exist. Use PATCH to update." },
      { status: 409 }
    );
  }

  const doc = await UserDetails.create(body);
  return NextResponse.json({ ...doc.toObject(), id: doc._id.toString() }, { status: 201 });
}

export async function PATCH(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const body = await req.json();

  if (body.action === "submit") {
    const { storeId } = body;

    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const doc = await UserDetails.findOneAndUpdate(
      { uid },
      {
        $set: {
          status: "submitted",
          submittedAt: new Date(),
          businessName: body.businessName,
          businessAddress: body.businessAddress,
          businessCategory: body.businessCategory,
          gstNumber: body.gstNumber,
          businessRegNumber: body.businessRegNumber,
          aadharNumber: body.aadharNumber,
          panNumber: body.panNumber,
          ownerPhoto: body.ownerPhoto,
          storeName: body.storeName,
          storeDescription: body.storeDescription,
          storeImages: body.storeImages || [],
          storeAddress: body.storeAddress,
          storeCity: body.storeCity,
          storeCoverage: body.storeCoverage,
        },
      },
      { upsert: true, returnDocument: "after", new: true }
    ).lean();

    if (!doc) {
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          ownerStatus: "PENDING",
          appliedAt: new Date(),
          businessName: body.businessName,
          businessAddress: body.businessAddress,
          businessCategory: body.businessCategory,
          gstNumber: body.gstNumber || "",
          businessRegNumber: body.businessRegNumber || "",
          aadharNumber: body.aadharNumber || "",
          panNumber: body.panNumber || "",
        },
      }
    );

    return NextResponse.json({ ...doc, id: doc._id.toString() });
  }

  const doc = await UserDetails.findOneAndUpdate(
    { uid },
    { $set: body },
    { upsert: true, returnDocument: "after", new: true }
  ).lean();

  if (!doc) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ ...doc, id: doc._id.toString() });
}

export async function DELETE(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  await UserDetails.findOneAndDelete({ uid });
  return NextResponse.json({ message: "Deleted" });
}
