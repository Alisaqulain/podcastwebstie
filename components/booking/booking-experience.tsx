"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { PaymentTrustBadges } from "@/components/payment/payment-trust-badges";
import { BOOKING_WEEKDAYS } from "@/lib/booking-rules";
import Link from "next/link";

export type PackagePublic = {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  features: string[];
  badge?: string;
  active?: boolean;
};

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Razorpay script failed"))
      );
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay script failed"));
    document.body.appendChild(s);
  });
}

function formatInrPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatSlotLabel(t: string) {
  const [h, m] = t.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function payablePaise(pkg: PackagePublic) {
  const base = Math.round(pkg.price);
  const d =
    pkg.discountPrice != null && pkg.discountPrice > 0
      ? Math.round(pkg.discountPrice)
      : null;
  if (d != null && d < base) return d;
  return base;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function BookingExperience({
  initialPackages,
}: {
  initialPackages: PackagePublic[];
}) {
  const [packages, setPackages] = useState<PackagePublic[]>(initialPackages);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPackages[0]?._id ?? null
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [topic, setTopic] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [time, setTime] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  useEffect(() => {
    if (initialPackages.length) return;
    (async () => {
      const res = await fetch("/api/packages");
      const data = (await res.json()) as PackagePublic[];
      setPackages(Array.isArray(data) ? data : []);
      if (data?.[0]?._id) setSelectedId(data[0]._id);
    })();
  }, [initialPackages.length]);

  const selected = useMemo(
    () => packages.find((p) => p._id === selectedId) ?? null,
    [packages, selectedId]
  );

  useEffect(() => {
    if (!dateStr) {
      setSlots([]);
      setTime("");
      return;
    }
    let cancelled = false;
    (async () => {
      setSlotLoading(true);
      try {
        const res = await fetch(
          `/api/bookings/availability?date=${encodeURIComponent(dateStr)}`
        );
        const data = (await res.json()) as { slots?: string[]; error?: string };
        if (!cancelled) {
          setSlots(Array.isArray(data.slots) ? data.slots : []);
          setTime("");
          if (data.error && !data.slots?.length) {
            setMessage({ type: "err", text: data.error });
          }
        }
      } finally {
        if (!cancelled) setSlotLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateStr]);

  const logoUrl = `${SITE.url.replace(/\/$/, "")}/logo.png`;

  const scrollToForm = useCallback(() => {
    document
      .getElementById("booking-details")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectPackage = useCallback(
    (id: string) => {
      setSelectedId(id);
      setMessage(null);
      requestAnimationFrame(scrollToForm);
    },
    [scrollToForm]
  );

  const calendarCells = useMemo(() => {
    const y = calMonth.getFullYear();
    const m = calMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cells: { day: number | null; date: Date | null }[] = [];
    for (let i = 0; i < firstDow; i++) cells.push({ day: null, date: null });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, date: new Date(y, m, d) });
    }
    return { cells, today };
  }, [calMonth]);

  function isSelectable(d: Date) {
    const day = d.getDay();
    if (!BOOKING_WEEKDAYS.includes(day as 3 | 5)) return false;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    if (d < startToday) return false;
    return true;
  }

  async function startPayment(bid: string) {
    await loadRazorpayScript();
    if (!window.Razorpay) throw new Error("Checkout could not load.");

    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bid }),
    });
    const orderJson = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok) {
      throw new Error(
        typeof orderJson.error === "string"
          ? orderJson.error
          : "Could not start checkout."
      );
    }

    const {
      orderId,
      amount,
      currency,
      keyId,
      planTitle,
    }: {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      planTitle?: string;
    } = orderJson;

    return new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: keyId,
        amount,
        currency: currency || "INR",
        name: "BHAW Namrata",
        description: planTitle
          ? `${planTitle} — Coaching / Podcast Service`
          : "Coaching / Podcast Service",
        image: logoUrl,
        order_id: orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.replace(/\D/g, "").slice(0, 15) || undefined,
        },
        theme: { color: "#A67C2E" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bid,
              }),
            });
            const verifyJson = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) {
              throw new Error(
                typeof verifyJson.error === "string"
                  ? verifyJson.error
                  : "Verification failed."
              );
            }
            setMessage({
              type: "ok",
              text: "Booking confirmed. Namrata will reach out with session details.",
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        modal: {
          ondismiss: () => resolve(),
        },
      });
      rzp.open();
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!selectedId) {
      setMessage({ type: "err", text: "Select a package first." });
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage({
        type: "err",
        text: "Name, email, and phone are required.",
      });
      return;
    }
    if (!businessName.trim() || !topic.trim()) {
      setMessage({
        type: "err",
        text: "Business name and session topic are required.",
      });
      return;
    }
    if (!dateStr || !time) {
      setMessage({
        type: "err",
        text: "Choose a valid date (Wed/Fri) and time slot.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          businessName: businessName.trim(),
          topic: topic.trim(),
          date: dateStr,
          time,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not create booking."
        );
      }
      const bid = data.bookingId as string;
      await startPayment(bid);
    } catch (err) {
      setMessage({
        type: "err",
        text:
          err instanceof Error ? err.message : "Something went wrong. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="packages" className="scroll-mt-28 space-y-16 md:space-y-24">
      <section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
              Packages
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-luxury-heading md:text-4xl">
              Choose your container for transformation
            </h2>
            <p className="mt-4 text-base text-luxury-body">
              Each package is crafted for expression, presence, and sustainable
              confidence. Select one to unlock the booking calendar—sessions are
              held on{" "}
              <strong className="text-luxury-heading">Wednesdays &amp; Fridays</strong>.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {packages.length === 0 ? (
              <div className="glass-panel xl:col-span-3 rounded-4xl border border-dashed border-brand-gold/40 p-12 text-center text-luxury-body">
                Packages are being curated. Please check back soon or{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-gold-deep underline"
                >
                  contact us
                </Link>
                .
              </div>
            ) : (
              packages.map((pkg, i) => {
                const active = pkg._id === selectedId;
                const pay = payablePaise(pkg);
                const showStrike =
                  pkg.discountPrice != null &&
                  pkg.discountPrice > 0 &&
                  pay < Math.round(pkg.price);
                const popular =
                  pkg.badge?.toLowerCase().includes("popular") ?? false;
                return (
                  <motion.article
                    key={pkg._id}
                    layout
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className={cn(
                      "glass-panel group relative flex flex-col overflow-hidden rounded-4xl border border-luxury-border p-8 shadow-luxury-card transition-shadow duration-300 hover:border-brand-gold/45 hover:shadow-gold-glow",
                      active &&
                        "ring-2 ring-brand-gold/45 shadow-[0_12px_40px_-10px_rgba(201,161,74,0.28)]",
                      popular && !active && "ring-1 ring-brand-gold/35"
                    )}
                  >
                    {pkg.badge ? (
                      <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        {pkg.badge}
                      </span>
                    ) : null}
                    <h3 className="pr-24 font-display text-xl font-semibold text-luxury-heading md:text-2xl">
                      {pkg.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
                      {pkg.description}
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5 text-sm text-luxury-body">
                      {pkg.features?.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-deep" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 border-t border-luxury-border pt-6">
                      <div className="flex flex-wrap items-end gap-2">
                        {showStrike ? (
                          <span className="text-sm text-luxury-muted line-through">
                            {formatInrPaise(pkg.price)}
                          </span>
                        ) : null}
                        <span className="font-display text-3xl font-semibold bg-gold-gradient bg-clip-text text-transparent tabular-nums">
                          {formatInrPaise(pay)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectPackage(pkg._id)}
                        className={cn(
                          "mt-5 w-full rounded-full py-3.5 text-sm font-semibold tracking-wide transition",
                          active
                            ? "bg-gold-gradient text-[#1A1A1A] shadow-gold-glow"
                            : "border-2 border-luxury-border bg-transparent text-luxury-heading hover:border-brand-gold hover:bg-brand-gold/10"
                        )}
                      >
                        {active ? "Selected" : "Select package"}
                      </button>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
        </Container>
      </section>

      <section id="booking-details" className="scroll-mt-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={onSubmit}
              className="surface-form space-y-6 rounded-4xl p-8 md:p-10"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold text-luxury-heading">
                  Your details
                </h3>
                <p className="mt-2 text-sm text-luxury-muted">
                  {selected
                    ? `Booking for: ${selected.title}`
                    : "Select a package above."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="bk-name">
                  <input
                    id="bk-name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    required
                  />
                </Field>
                <Field label="Email" htmlFor="bk-email">
                  <input
                    id="bk-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-input"
                    required
                  />
                </Field>
                <Field label="Phone / WhatsApp" htmlFor="bk-phone">
                  <input
                    id="bk-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="field-input"
                    required
                  />
                </Field>
                <Field label="Business / brand name" htmlFor="bk-biz">
                  <input
                    id="bk-biz"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="field-input"
                    required
                  />
                </Field>
              </div>
              <Field label="What would you like to focus on?" htmlFor="bk-topic">
                <textarea
                  id="bk-topic"
                  rows={4}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="field-input resize-y"
                  required
                />
              </Field>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                    Date
                  </p>
                  <div className="mt-3 rounded-3xl border border-luxury-border bg-luxury-bg p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        className="rounded-xl p-2 text-luxury-heading hover:bg-muted"
                        onClick={() =>
                          setCalMonth(
                            new Date(
                              calMonth.getFullYear(),
                              calMonth.getMonth() - 1,
                              1
                            )
                          )
                        }
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-semibold text-luxury-heading">
                        {calMonth.toLocaleString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        className="rounded-xl p-2 text-luxury-heading hover:bg-muted"
                        onClick={() =>
                          setCalMonth(
                            new Date(
                              calMonth.getFullYear(),
                              calMonth.getMonth() + 1,
                              1
                            )
                          )
                        }
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-luxury-muted">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-1">
                      {calendarCells.cells.map((c, idx) => {
                        if (!c.date || c.day == null) {
                          return <span key={`e-${idx}`} className="h-9" />;
                        }
                        const ok = isSelectable(c.date);
                        const isSel = dateStr === ymd(c.date);
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!ok}
                            onClick={() => {
                              if (ok && c.date) setDateStr(ymd(c.date));
                            }}
                            className={cn(
                              "flex h-9 items-center justify-center rounded-xl text-sm transition",
                              !ok && "cursor-not-allowed text-luxury-border",
                              ok &&
                                !isSel &&
                                "text-luxury-body hover:bg-brand-gold/15 hover:text-luxury-heading",
                              isSel &&
                                "bg-gold-gradient font-semibold text-[#1A1A1A] shadow-md"
                            )}
                          >
                            {c.day}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-xs text-luxury-muted">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Wednesdays &amp; Fridays only · past dates disabled
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                    Time (IST)
                  </p>
                  <div className="mt-3 min-h-[200px] rounded-3xl border border-luxury-border bg-luxury-bg p-4">
                    <AnimatePresence mode="wait">
                      {!dateStr ? (
                        <motion.p
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center text-sm text-luxury-muted"
                        >
                          Pick a date to see open slots.
                        </motion.p>
                      ) : slotLoading ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-brand-gold-deep" />
                        </div>
                      ) : slots.length === 0 ? (
                        <p className="py-12 text-center text-sm text-luxury-muted">
                          No slots left on this day. Try another Wednesday or
                          Friday.
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {slots.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setTime(s)}
                              className={cn(
                                "rounded-2xl border px-3 py-3 text-sm font-medium transition",
                                time === s
                                  ? "border-brand-gold/50 bg-brand-gold/15 text-luxury-heading"
                                  : "border-luxury-border bg-surface text-luxury-body hover:border-brand-gold/40 hover:bg-muted"
                              )}
                            >
                              {formatSlotLabel(s)}
                            </button>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !selected}
                className="inline-flex w-full min-h-14 items-center justify-center gap-2 rounded-full bg-gold-gradient text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.01] disabled:opacity-55"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  "Continue to secure payment"
                )}
              </button>

              {message ? (
                <p
                  className={cn(
                    "text-sm font-medium",
                    message.type === "ok" ? "text-emerald-700" : "text-red-600"
                  )}
                  role="status"
                >
                  {message.text}
                </p>
              ) : null}

              <PaymentTrustBadges />
            </motion.form>

            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="glass-panel rounded-4xl p-8 shadow-luxury-card">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
                  Summary
                </p>
                <p className="mt-4 text-sm text-luxury-body">
                  {selected ? selected.title : "No package selected"}
                </p>
                {selected ? (
                  <p className="mt-6 font-display text-3xl font-semibold bg-gold-gradient bg-clip-text text-transparent tabular-nums">
                    {formatInrPaise(payablePaise(selected))}
                  </p>
                ) : null}
                <ul className="mt-6 space-y-2 text-xs text-luxury-muted">
                  <li>Razorpay secure checkout</li>
                  <li>Calendar holds Wed &amp; Fri (IST)</li>
                  <li>Confirmation after successful payment</li>
                </ul>
              </div>
              <p className="text-center text-xs text-luxury-muted">
                By paying you agree to our{" "}
                <Link href="/terms" className="text-brand-gold-deep underline hover:text-brand-gold">
                  Terms
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="text-brand-gold-deep underline hover:text-brand-gold">
                  Privacy
                </Link>
                , and{" "}
                <Link href="/refund-policy" className="text-brand-gold-deep underline hover:text-brand-gold">
                  Refund policy
                </Link>
                .
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sm:col-span-1">
      <label
        className="text-xs font-semibold uppercase tracking-wide text-luxury-heading"
        htmlFor={htmlFor}
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
