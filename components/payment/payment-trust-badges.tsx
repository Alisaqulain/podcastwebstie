import { Lock, ShieldCheck } from "lucide-react";

export function PaymentTrustBadges({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-luxury-muted ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-luxury-border bg-luxury-bg px-3 py-1.5 text-luxury-body shadow-sm">
        <Lock className="h-3.5 w-3.5 text-brand-gold-deep" aria-hidden />
        Secure payment
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-luxury-border bg-luxury-bg px-3 py-1.5 text-luxury-body shadow-sm">
        <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-deep" aria-hidden />
        100% safe checkout
      </span>
    </div>
  );
}
