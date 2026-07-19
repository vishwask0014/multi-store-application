import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const targetType = url.searchParams.get("targetType");
    const targetId = url.searchParams.get("targetId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    if (!targetType || !targetId) {
      return NextResponse.json({ error: "targetType and targetId are required" }, { status: 400 });
    }

    const filter = { targetType, targetId: new mongoose.Types.ObjectId(targetId) };
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "name photo")
        .lean(),
      Review.countDocuments(filter),
    ]);

    const avgResult = await Review.aggregate([
      { $match: filter },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      items: reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      avgRating: avgResult[0]?.avgRating || 0,
      ratingCount: avgResult[0]?.count || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, targetType, targetId, rating, comment } = body;

    if (!userId || !targetType || !targetId || !rating || !comment) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await Review.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
    });
    if (existing) {
      return NextResponse.json({ error: "You already reviewed this" }, { status: 409 });
    }

    const review = await Review.create({
      userId: new mongoose.Types.ObjectId(userId),
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
      rating: Math.min(5, Math.max(1, rating)),
      comment,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
