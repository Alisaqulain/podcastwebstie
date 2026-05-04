import type { ReactNode } from "react";

export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <div className="prose-blog max-w-none space-y-6 text-luxury-body [&_h2]:mt-12 [&_h2]:first:mt-0 [&_ul]:space-y-2">
      {children}
    </div>
  );
}
