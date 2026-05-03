import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-deep">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-brand-dark sm:text-4xl md:text-[2.75rem] leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base text-brand-dark/70 md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
