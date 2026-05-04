import Razorpay from "razorpay";

export function getRazorpay(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials are not configured.");
  }
  return new Razorpay({ key_id, key_secret });
}

export function assertRazorpayConfigured(): { keyId: string } | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return null;
  return { keyId };
}
