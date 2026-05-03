"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <main
      className={cn(
        "pb-[env(safe-area-inset-bottom,0px)]",
        !isAdmin &&
          "pt-[max(5.25rem,calc(4.5rem+env(safe-area-inset-top,0px)))] sm:pt-24"
      )}
    >
      {children}
    </main>
  );
}
