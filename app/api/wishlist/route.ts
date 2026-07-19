import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Wishlist } from "@/lib/models/Wishlist";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ userId }).lean();
    if (!wishlist) {
      wishlist = { userId, items: [] } as any;
    }
    return NextResponse.json(wishlist);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, targetType, targetId } = body;

    if (!userId || !targetType || !targetId) {
      return NextResponse.json({ error: "userId, targetType, and targetId are required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          items: {
            targetType,
            targetId: new mongoose.Types.ObjectId(targetId),
            addedAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json(wishlist);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, targetType, targetId } = body;

    if (!userId || !targetType || !targetId) {
      return NextResponse.json({ error: "userId, targetType, and targetId are required" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: {
            targetType,
            targetId: new mongoose.Types.ObjectId(targetId),
          },
        },
      },
      { new: true }
    ).lean();

    return NextResponse.json(wishlist || { userId, items: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
