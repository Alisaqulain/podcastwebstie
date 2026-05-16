import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = Omit<ButtonProps, "variant"> & {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
};

const variantMap = {
  primary: "primary" as const,
  outline: "secondary" as const,
  ghost: "ghost" as const,
};

/** @deprecated Prefer `Button` — kept for backward compatibility. */
export function GoldButton({
  children,
  className,
  variant = "primary",
  ...rest
}: Props) {
  return (
    <Button
      variant={variantMap[variant]}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Button>
  );
}
