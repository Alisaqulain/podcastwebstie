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
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold";

  const styles = {
    primary:
      "bg-gold-gradient text-brand-dark shadow-gold-glow hover:brightness-105 hover:shadow-lg active:scale-[0.98]",
    outline:
      "border border-brand-gold/50 bg-white/40 text-brand-dark backdrop-blur-md hover:bg-brand-gold/10 hover:border-brand-gold",
    ghost: "text-brand-dark hover:bg-brand-gold/10",
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
