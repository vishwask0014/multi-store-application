import "server-only";

import { connectDB } from "@/lib/mongodb";
import { User, UserRole, OwnerStatus, AccountStatus } from "@/lib/models/User";

export interface MongoUserData {
  id: string;
  uid: string;
  phone: string;
  name?: string;
  role: UserRole;
  ownerStatus: OwnerStatus;
  status: AccountStatus;
  businessName?: string;
  businessAddress?: string;
  businessCategory?: string;
  gstNumber?: string;
  businessRegNumber?: string;
  aadharNumber?: string;
  panNumber?: string;
  appliedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

function serializeUser(doc: any): MongoUserData {
  return {
    id: doc._id.toString(),
    uid: doc.uid,
    phone: doc.phone,
    name: doc.name,
    role: doc.role,
    ownerStatus: doc.ownerStatus,
    status: doc.status,
    businessName: doc.businessName,
    businessAddress: doc.businessAddress,
    businessCategory: doc.businessCategory,
    gstNumber: doc.gstNumber,
    businessRegNumber: doc.businessRegNumber,
    aadharNumber: doc.aadharNumber,
    panNumber: doc.panNumber,
    appliedAt: doc.appliedAt,
    reviewedAt: doc.reviewedAt,
    reviewedBy: doc.reviewedBy,
    rejectionReason: doc.rejectionReason,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function findUserByUid(uid: string): Promise<MongoUserData | null> {
  await connectDB();
  const doc = await User.findOne({ uid }).lean();
  if (!doc) return null;
  return serializeUser(doc);
}

export async function createUser(uid: string, phone: string, name?: string): Promise<MongoUserData> {
  await connectDB();
  const doc = await User.create({
    uid,
    phone,
    name: name || "",
    role: "CUSTOMER",
    ownerStatus: "NONE",
    status: "ACTIVE",
  });
  return serializeUser(doc.toObject());
}

export async function upsertUser(
  uid: string,
  phone: string,
  name?: string
): Promise<MongoUserData> {
  await connectDB();
  const doc = await User.findOneAndUpdate(
    { uid },
    {
      $set: {
        phone,
        name: name || "",
      },
      $setOnInsert: {
        role: "CUSTOMER",
        ownerStatus: "NONE",
        status: "ACTIVE",
      },
    },
    { upsert: true, returnDocument: "after", new: true }
  ).lean();
  return serializeUser(doc);
}

export async function updateProfile(
  uid: string,
  updates: { name?: string }
): Promise<MongoUserData | null> {
  await connectDB();
  const doc = await User.findOneAndUpdate(
    { uid },
    { $set: updates },
    { returnDocument: "after" }
  ).lean();
  if (!doc) return null;
  return serializeUser(doc);
}

export async function applyForOwnership(
  uid: string,
  businessData: {
    businessName: string;
    businessAddress: string;
    businessCategory: string;
    gstNumber?: string;
    businessRegNumber?: string;
    aadharNumber?: string;
    panNumber?: string;
  }
): Promise<MongoUserData | null> {
  await connectDB();
  const doc = await User.findOneAndUpdate(
    { uid },
    {
      $set: {
        ...businessData,
        ownerStatus: "PENDING",
        appliedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  ).lean();
  if (!doc) return null;
  return serializeUser(doc);
}

export async function reviewOwnership(
  uid: string,
  decision: "approve" | "reject",
  reviewedBy: string,
  rejectionReason?: string
): Promise<MongoUserData | null> {
  await connectDB();
  const updates: Record<string, any> = {
    reviewedAt: new Date(),
    reviewedBy,
  };

  if (decision === "approve") {
    updates.role = "OWNER";
    updates.ownerStatus = "VERIFIED";
  } else {
    updates.role = "CUSTOMER";
    updates.ownerStatus = "REJECTED";
    if (rejectionReason) updates.rejectionReason = rejectionReason;
  }

  const doc = await User.findOneAndUpdate(
    { uid },
    { $set: updates },
    { returnDocument: "after" }
  ).lean();
  if (!doc) return null;
  return serializeUser(doc);
}

export function canAccessOwnerDashboard(user: MongoUserData | null): boolean {
  if (!user) return false;
  return user.role === "OWNER" && user.ownerStatus === "VERIFIED" && user.status === "ACTIVE";
}

export function getOwnerStatusMessage(ownerStatus: OwnerStatus): string | null {
  switch (ownerStatus) {
    case "PENDING":
      return "Your seller account is under verification. Please wait for approval.";
    case "REJECTED":
      return "Your seller application was rejected. Please contact support.";
    default:
      return null;
  }
}
