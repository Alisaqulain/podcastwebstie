import { ObjectId } from "mongodb";

export type BookingPaymentStatus = "pending" | "paid" | "failed";

export interface Booking {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  topic: string;
  packageId: ObjectId;
  /** Denormalized for admin exports */
  packageTitle: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm 24h */
  time: string;
  /** Amount charged in INR (rupees) after payment */
  amount: number;
  paymentStatus: BookingPaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
