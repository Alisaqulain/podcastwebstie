import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import { getRazorpay, assertRazorpayConfigured } from "@/lib/razorpay-server";
import { packagePayablePaise } from "@/lib/booking-rules";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  bookingId: z.string().min(1),
});

function receiptId() {
  const id = `r_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return id.slice(0, 40);
}

export async function POST(req: NextRequest) {
  if (!assertRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments are temporarily unavailable." },
      { status: 503 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!ObjectId.isValid(parsed.data.bookingId)) {
    return NextResponse.json({ error: "Invalid booking." }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 503 }
    );
  }

  const booking = await db.collection("bookings").findOne({
    _id: new ObjectId(parsed.data.bookingId),
  });

  if (!booking || booking.paymentStatus !== "pending") {
    return NextResponse.json(
      { error: "Booking not found or already processed." },
      { status: 400 }
    );
  }

  const pkg = await db.collection("packages").findOne({
    _id: booking.packageId,
    active: true,
  });

  if (!pkg) {
    return NextResponse.json({ error: "Package unavailable." }, { status: 400 });
  }

  const amountPaise = packagePayablePaise(
    Number(pkg.price),
    pkg.discountPrice as number | null | undefined
  );
  if (amountPaise == null) {
    return NextResponse.json({ error: "Invalid package price." }, { status: 400 });
  }

  try {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: receiptId(),
      notes: {
        bookingId: parsed.data.bookingId,
        packageId: String(booking.packageId),
        packageTitle: String(pkg.title),
        date: String(booking.date),
        time: String(booking.time),
      },
    });

    await db.collection("bookings").updateOne(
      { _id: booking._id },
      {
        $set: {
          razorpay_order_id: order.id,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: parsed.data.bookingId,
      planTitle: String(pkg.title),
    });
  } catch (e) {
    console.error("[create-order]", e);
    return NextResponse.json(
      { error: "Could not create order. Please try again." },
      { status: 502 }
    );
  }
}
