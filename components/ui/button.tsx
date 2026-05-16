import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const variants = {
  primary:
    "bg-gold-gradient text-[var(--gold-foreground)] shadow-gold-glow hover:brightness-105 hover:shadow-gold-glow-lg active:brightness-95",
  secondary:
    "border-2 border-accent bg-transparent text-accent hover:bg-[var(--btn-secondary-hover-bg)] hover:text-[var(--btn-secondary-hover-fg)] active:scale-[0.98]",
  outline:
    "border border-luxury-border bg-surface/90 text-luxury-heading backdrop-blur-sm hover:border-brand-gold/40 hover:bg-muted active:scale-[0.98]",
  ghost:
    "text-luxury-body hover:bg-muted hover:text-luxury-heading active:scale-[0.98]",
} as const;

const sizes = {
  sm: "min-h-10 px-5 py-2 text-sm",
  md: "min-h-12 px-7 py-3 text-sm",
  lg: "min-h-[3.25rem] px-8 py-3.5 text-sm",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
};

export type ButtonProps = BaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> &
  Omit<ComponentProps<"button">, "className" | "children" | "type">;

type Props = ButtonProps;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...rest
}: Props) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
    "touch-manipulation disabled:pointer-events-none disabled:opacity-55",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest;
    return (
      <Link href={href} className={base} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={base} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
