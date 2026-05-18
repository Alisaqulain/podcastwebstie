import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

type SiteLogoProps = {
  className?: string;
  variant?: "nav" | "footer" | "auth";
  priority?: boolean;
  /** Parent must be `relative` with defined size. */
  fill?: boolean;
};

const circularFrameClass: Record<"nav" | "footer" | "auth", string> = {
  nav: "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14",
  footer: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20",
  auth: "h-20 w-20 sm:h-24 sm:w-24",
};

function CircularLogo({
  variant,
  priority,
  className,
}: {
  variant: "nav" | "footer" | "auth";
  priority?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "logo-pill relative inline-flex shrink-0 overflow-hidden rounded-full ring-1",
        circularFrameClass[variant],
        className
      )}
    >
      <Image
        src={SITE.logoSrc}
        alt={`${SITE.name} — ${SITE.tagline}`}
        fill
        sizes="(max-width: 768px) 80px, 96px"
        priority={priority}
        className="object-cover object-center"
      />
    </span>
  );
}

export function SiteLogo({
  className,
  variant = "nav",
  priority = false,
  fill: useFill,
}: SiteLogoProps) {
  if (useFill) {
    return (
      <Image
        src={SITE.logoSrc}
        alt={`${SITE.name} — ${SITE.tagline}`}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        priority={priority}
        className={cn("object-cover object-center", className)}
      />
    );
  }

  if (variant === "nav" || variant === "footer" || variant === "auth") {
    return (
      <CircularLogo variant={variant} priority={priority} className={className} />
    );
  }

  return null;
}
