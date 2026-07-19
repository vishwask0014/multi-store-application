import mongoose, { Schema, Document } from "mongoose";

export interface IStoreAvailability {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  open: string;
  close: string;
  closed: boolean;
}

export interface IStoreContact {
  phone?: string;
  email?: string;
}

export interface IStoreSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}

export interface IStore extends Document {
  name: string;
  slug: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images: string[];
  description?: string;
  address?: string;
  city?: string;
  coverage?: number;
  ownerUid?: string;
  gallery: string[];
  categories: string[];
  availability: IStoreAvailability[];
  logo?: string;
  banner?: string;
  status: "open" | "closed" | "temporarily_closed";
  contact: IStoreContact;
  socialLinks: IStoreSocialLinks;
  deletedAt?: Date;
  createdAt: Date;
}

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const AvailabilitySchema = new Schema<IStoreAvailability>(
  {
    day: { type: String, enum: days, required: true },
    open: { type: String, default: "09:00" },
    close: { type: String, default: "18:00" },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    tag: { type: String, enum: ["Fulfilled", "Filled"], default: "Fulfilled" },
    offeringCount: { type: Number, default: 0 },
    images: [{ type: String }],
    description: { type: String },
    address: { type: String },
    city: { type: String },
    coverage: { type: Number },
    ownerUid: { type: String },
    gallery: [{ type: String }],
    categories: [{ type: String }],
    availability: { type: [AvailabilitySchema], default: days.map((d) => ({ day: d, open: "09:00", close: "18:00", closed: d === "sunday" })) },
    logo: { type: String },
    banner: { type: String },
    status: { type: String, enum: ["open", "closed", "temporarily_closed"], default: "open" },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
      website: { type: String },
    },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

StoreSchema.pre("save", function () {
  if (this.isModified("name") && !this.slug) {
    this.slug = generateSlug(this.name);
  }
});

StoreSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update?.name && !update.slug) {
    update.slug = generateSlug(update.name as string);
  }
});

export const Store =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);
