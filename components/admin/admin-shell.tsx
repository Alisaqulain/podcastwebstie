"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Mic2,
  FileText,
  Heart,
  Inbox,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/podcasts", label: "Podcasts", icon: Mic2 },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: Heart },
  { href: "/admin/contacts", label: "Contacts", icon: Inbox },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-brand-cream pt-[env(safe-area-inset-top,0px)]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream/80">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand-gold/15 bg-brand-dark text-brand-cream md:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="font-display text-lg font-semibold">BHAW Admin</p>
            <p className="text-xs text-brand-cream/55">Namrata · CMS</p>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {nav.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-brand-cream/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 text-sm text-brand-cream/60 hover:text-white"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-brand-gold hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-h-screen min-w-0 flex-1">
          <div className="border-b border-brand-gold/15 bg-white/50 px-[max(1rem,env(safe-area-inset-left,0px))] py-4 pr-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] backdrop-blur md:hidden">
            <p className="font-display text-lg font-semibold text-brand-dark">
              Admin
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-10 items-center rounded-full border border-brand-gold/25 bg-white/70 px-3 py-2 text-xs font-medium text-brand-dark touch-manipulation active:scale-[0.98]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px)+1rem)] md:p-10 md:pb-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
