import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/mongodb";
import { getRazorpay, assertRazorpayConfigured } from "@/lib/razorpay-server";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  bookingId: z.string().min(1),
});

function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const body = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(
      Buffer.from(expected, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!assertRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are temporarily unavailable." },
      { status: 503 }
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = parsed.data;

  if (!ObjectId.isValid(bookingId)) {
    return NextResponse.json({ error: "Invalid booking." }, { status: 400 });
  }

  if (
    !verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    )
  ) {
    return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
  }

  let amountInr: number;
  try {
    const rzp = getRazorpay();
    const payment = await rzp.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
    }
    if (payment.status !== "captured") {
      return NextResponse.json(
        { error: "Payment was not completed successfully." },
        { status: 400 }
      );
    }
    const paise = Number(payment.amount);
    if (!Number.isFinite(paise)) {
      return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }
    amountInr = Math.round(paise) / 100;
  } catch (e) {
    console.error("[verify-payment] fetch", e);
    return NextResponse.json(
      { error: "Could not verify payment with Razorpay." },
      { status: 502 }
    );
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      {
        error:
          "Payment verified but could not be saved. Contact support with your payment ID.",
      },
      { status: 503 }
    );
  }

  const booking = await db.collection("bookings").findOne({
    _id: new ObjectId(bookingId),
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (booking.razorpay_order_id && booking.razorpay_order_id !== razorpay_order_id) {
    return NextResponse.json({ error: "Order does not match this booking." }, { status: 400 });
  }

  if (booking.paymentStatus === "paid" && booking.razorpay_payment_id === razorpay_payment_id) {
    return NextResponse.json({
      ok: true,
      duplicate: true,
      paymentId: razorpay_payment_id,
    });
  }

  if (booking.paymentStatus === "paid") {
    return NextResponse.json(
      { error: "This booking is already paid." },
      { status: 400 }
    );
  }

  const dupPay = await db.collection("bookings").findOne({
    razorpay_payment_id,
    paymentStatus: "paid",
  });
  if (dupPay) {
    return NextResponse.json({ error: "Payment already linked to a booking." }, { status: 400 });
  }

  await db.collection("bookings").updateOne(
    { _id: new ObjectId(bookingId), paymentStatus: "pending" },
    {
      $set: {
        paymentStatus: "paid",
        razorpay_payment_id,
        razorpay_order_id,
        amount: amountInr,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
}
