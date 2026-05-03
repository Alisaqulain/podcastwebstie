import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  variant?: "nav" | "footer" | "auth";
  priority?: boolean;
  /** Parent must be `relative` with defined size. */
  fill?: boolean;
};

const variantClass: Record<NonNullable<SiteLogoProps["variant"]>, string> = {
  nav: "h-10 w-auto max-w-full sm:h-11 md:h-12 lg:h-14 lg:max-w-[380px]",
  footer:
    "h-14 w-auto max-w-full sm:h-16 sm:max-w-[min(100%,320px)] md:h-[4.5rem] md:max-w-[400px] lg:h-20 lg:max-w-[440px]",
  auth: "mx-auto h-16 w-auto max-w-[min(100%,320px)] sm:h-20 sm:max-w-[360px]",
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
        src="/logo.png"
        alt="BHAW Namrata — Expression is Power"
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        priority={priority}
        className={cn("object-contain p-4 sm:p-6", className)}
      />
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="BHAW Namrata — Expression is Power"
      width={640}
      height={240}
      priority={priority}
      className={cn(
        "object-contain object-left",
        variantClass[variant],
        className
      )}
    />
  );
}
