import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  /** Optional id on the section h2 (landmarks / aria-labelledby). */
  id?: string;
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold-deep">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-balance font-display text-[1.65rem] font-semibold leading-[1.12] text-luxury-heading sm:text-4xl md:text-[2.75rem]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-pretty text-[0.9375rem] leading-relaxed text-luxury-body sm:mt-4 sm:text-base md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
