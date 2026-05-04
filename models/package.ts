import { ObjectId } from "mongodb";

/** Prices stored in paise (smallest INR unit) for Razorpay */
export interface CoachingPackage {
  _id?: ObjectId;
  title: string;
  description: string;
  /** Price in paise */
  price: number;
  /** Discounted price in paise; omit or null for no discount */
  discountPrice?: number | null;
  features: string[];
  badge?: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PackageInput = Omit<
  CoachingPackage,
  "_id" | "createdAt" | "updatedAt"
> & {
  createdAt?: Date;
  updatedAt?: Date;
};
