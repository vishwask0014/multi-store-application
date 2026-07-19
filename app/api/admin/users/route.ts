import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { UserDetails } from "@/lib/models/UserDetails";
import { Store } from "@/lib/models/Store";

export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const body = await req.json();
  const { decision, reviewedBy, rejectionReason } = body;

  if (!decision || !reviewedBy) {
    return NextResponse.json(
      { error: "decision and reviewedBy are required" },
      { status: 400 }
    );
  }

  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json(
      { error: "decision must be 'approve' or 'reject'" },
      { status: 400 }
    );
  }

  await connectDB();

  const user = await User.findOne({ uid });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (decision === "approve") {
    await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          role: "OWNER",
          ownerStatus: "VERIFIED",
          reviewedAt: new Date(),
          reviewedBy,
        },
      }
    );

    const details = await UserDetails.findOne({ uid });
    if (details) {
      await UserDetails.findOneAndUpdate(
        { uid },
        {
          $set: {
            status: "approved",
            reviewedAt: new Date(),
            reviewedBy,
          },
        }
      );

      await Store.create({
        name: details.storeName,
        tag: "Fulfilled",
        offeringCount: 0,
        images: details.storeImages?.length > 0 ? details.storeImages : [],
        description: details.storeDescription || "",
        address: details.storeAddress || "",
        city: details.storeCity || "",
        coverage: details.storeCoverage || 10,
        ownerUid: uid,
      });
    }
  } else {
    await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          role: "CUSTOMER",
          ownerStatus: "REJECTED",
          reviewedAt: new Date(),
          reviewedBy,
          rejectionReason: rejectionReason || "",
        },
      }
    );

    await UserDetails.findOneAndUpdate(
      { uid },
      {
        $set: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedBy,
          rejectionReason: rejectionReason || "",
        },
      }
    );
  }

  const updated = await User.findOne({ uid }).lean();
  return NextResponse.json({ ...updated, id: updated!._id.toString() });
}
