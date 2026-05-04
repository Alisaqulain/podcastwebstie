"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PaymentTrustBadges } from "@/components/payment/payment-trust-badges";
import type { PackagePublic } from "@/components/booking/booking-experience";
import { cn } from "@/lib/utils";

function formatInrPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
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

export function PricingSection() {
  const [packages, setPackages] = useState<PackagePublic[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/packages");
      const data = (await res.json()) as PackagePublic[];
      setPackages(Array.isArray(data) ? data : []);
    })();
  }, []);

  return (
    <section
      id="pricing"
      className="scroll-mt-28 border-t border-luxury-border bg-luxury-section py-20 md:py-28"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
            Services &amp; pricing
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-luxury-heading md:text-4xl">
            Coaching packages designed to be felt—not just followed
          </h2>
          <p className="mt-4 text-base text-luxury-body">
            Live pricing from our studio CMS. Select a package on the booking
            page to choose your date and complete payment.{" "}
            <Link
              href="/refund-policy"
              className="font-medium text-brand-gold-deep underline underline-offset-4 hover:text-brand-gold"
            >
              Refund policy
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms"
              className="font-medium text-brand-gold-deep underline underline-offset-4 hover:text-brand-gold"
            >
              Terms
            </Link>
            .
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {packages.length === 0 ? (
            <div className="glass-panel xl:col-span-3 rounded-4xl border border-dashed border-brand-gold/40 p-12 text-center text-luxury-body">
              Packages will appear here once published in the admin panel.
              <div className="mt-6">
                <Link
                  href="/book"
                  className="inline-flex rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  Go to booking
                </Link>
              </div>
            </div>
          ) : (
            packages.slice(0, 3).map((pkg, i) => {
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className={cn(
                    "glass-panel relative flex flex-col overflow-hidden rounded-4xl p-8 shadow-luxury-card md:p-9",
                    "border border-luxury-border transition-shadow duration-300 hover:border-brand-gold/45 hover:shadow-gold-glow",
                    popular &&
                      "ring-2 ring-brand-gold/40 shadow-[0_12px_40px_-10px_rgba(201,161,74,0.28)]"
                  )}
                >
                  {pkg.badge ? (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {pkg.badge}
                    </span>
                  ) : null}
                  <h3 className="pr-20 font-display text-xl font-semibold text-luxury-heading">
                    {pkg.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-luxury-muted">
                    {pkg.description}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-luxury-body">
                    {pkg.features?.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-deep" />
                        {f}
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
                      <span className="font-display text-2xl font-semibold bg-gold-gradient bg-clip-text text-transparent tabular-nums md:text-3xl">
                        {formatInrPaise(pay)}
                      </span>
                    </div>
                    <Link
                      href={`/book#packages`}
                      className="mt-5 flex w-full items-center justify-center rounded-full bg-gold-gradient py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-gold-glow transition hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Select &amp; book
                    </Link>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        {packages.length > 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="text-sm font-semibold text-brand-gold-deep underline underline-offset-4 hover:text-brand-gold"
            >
              View full booking experience →
            </Link>
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <PaymentTrustBadges />
        </div>
      </Container>
    </section>
  );
}
