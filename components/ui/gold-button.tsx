import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function GoldButton({
  children,
  className,
  variant = "primary",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold";

  const styles = {
    primary:
      "bg-gold-gradient text-[#1A1A1A] shadow-gold-glow hover:brightness-110 hover:shadow-gold-glow-lg hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]",
    outline:
      "border-2 border-luxury-heading bg-transparent text-luxury-heading hover:bg-luxury-heading hover:text-white active:scale-[0.98]",
    ghost:
      "text-luxury-body hover:bg-luxury-border/50 hover:text-luxury-heading",
  };

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest;
    return (
      <Link
        href={href}
        className={cn(base, styles[variant], className)}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(base, styles[variant], className)}
      {...(rest as ComponentProps<"button">)}
    >
      {children}
    </button>
  );
}
