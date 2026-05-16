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

const variantClass: Record<NonNullable<SiteLogoProps["variant"]>, string> = {
  nav: "h-11 w-auto max-w-[4.75rem] sm:h-12 sm:max-w-[5.25rem] md:h-14 md:max-w-[6rem] lg:h-16 lg:max-w-[6.75rem]",
  footer:
    "h-16 w-auto max-w-[6.5rem] sm:h-[4.5rem] sm:max-w-[7.5rem] md:h-20 md:max-w-[8.5rem]",
  auth: "mx-auto h-20 w-auto max-w-[min(100%,220px)] sm:h-24 sm:max-w-[260px]",
};

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
        alt={`${SITE.name} — Premium podcast & media`}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        priority={priority}
        className={cn("object-contain p-4 sm:p-6", className)}
      />
    );
  }

  return (
    <Image
      src={SITE.logoSrc}
      alt={`${SITE.name} — Premium podcast & media`}
      width={512}
      height={512}
      priority={priority}
      className={cn(
        "object-contain object-center [forced-color-adjust:none]",
        variantClass[variant],
        className
      )}
    />
  );
}
