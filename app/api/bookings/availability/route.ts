import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  BOOKING_TIME_SLOTS,
  isAllowedBookingDay,
  parseYmd,
} from "@/lib/booking-rules";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const dateStr = new URL(req.url).searchParams.get("date")?.trim();
  if (!dateStr) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const date = parseYmd(dateStr);
  if (!date || !isAllowedBookingDay(date)) {
    return NextResponse.json({
      slots: [],
      error: "Only upcoming Wednesdays and Fridays can be booked.",
    });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json({
      slots: [...BOOKING_TIME_SLOTS],
    });
  }

  const taken = await db
    .collection("bookings")
    .find({
      date: dateStr,
      paymentStatus: "paid",
    })
    .project({ time: 1 })
    .toArray();

  const takenSet = new Set(taken.map((t) => String(t.time)));
  const slots = BOOKING_TIME_SLOTS.filter((s) => !takenSet.has(s));

  return NextResponse.json({ slots, date: dateStr });
}
