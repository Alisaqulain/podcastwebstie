import { ObjectId } from "mongodb";

export type PaymentStatus = "paid" | "failed" | "pending_verification";

export interface PaymentRecord {
  _id?: ObjectId;
  name: string;
  email: string;
  /** Amount in INR (rupees) for display and reporting */
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: PaymentStatus;
  createdAt: Date;
  planId?: string;
  contact?: string;
}
