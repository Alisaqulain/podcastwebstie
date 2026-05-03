"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SiteLogo } from "@/components/brand/site-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/podcast", label: "Podcast" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeMenu]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-brand-dark/35 backdrop-blur-[3px] lg:hidden"
            onClick={closeMenu}
          />
        ) : null}
      </AnimatePresence>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          "pt-[env(safe-area-inset-top,0px)]",
          scrolled
            ? "bg-brand-cream/90 py-2.5 shadow-glass backdrop-blur-xl sm:py-3"
            : "bg-brand-cream/80 py-3 backdrop-blur-md sm:bg-transparent sm:py-5 sm:backdrop-blur-none"
        )}
      >
        <Container className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <Link
              href="/"
              className="group inline-flex max-w-full items-center transition-transform active:scale-[0.98] sm:hover:scale-[1.02]"
              onClick={closeMenu}
            >
              <SiteLogo variant="nav" priority={pathname === "/"} />
            </Link>
          </div>

          <nav
            className="hidden items-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Main"
          >
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors xl:px-3",
                    active
                      ? "text-brand-dark"
                      : "text-brand-dark/65 hover:text-brand-dark"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-white/50 shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              href="/contact"
              className="rounded-2xl bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-md transition hover:shadow-gold-glow xl:px-5"
            >
              Book a Session
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 touch-manipulation items-center justify-center",
              "min-h-11 min-w-11 rounded-xl border border-brand-gold/30 bg-white/60 p-2.5",
              "text-brand-dark shadow-sm backdrop-blur transition active:scale-95 lg:hidden"
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>

        <AnimatePresence>
          {open ? (
            <motion.nav
              id="mobile-navigation"
              role="navigation"
              aria-label="Mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-brand-gold/15 bg-brand-cream/98 shadow-lg backdrop-blur-xl lg:hidden"
            >
              <Container className="max-h-[min(70vh,calc(100dvh-5.5rem))] overflow-y-auto overscroll-y-contain py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <ul className="flex flex-col gap-0.5">
                  {links.map((l) => {
                    const active = pathname === l.href;
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className={cn(
                            "flex min-h-12 items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors active:bg-white/50",
                            active
                              ? "bg-white/70 text-brand-dark shadow-sm"
                              : "text-brand-dark/80"
                          )}
                          onClick={closeMenu}
                        >
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/contact"
                  className="mt-3 flex min-h-12 items-center justify-center rounded-2xl bg-gold-gradient px-4 py-3.5 text-center text-base font-semibold text-brand-dark shadow-md active:brightness-95"
                  onClick={closeMenu}
                >
                  Book a Session
                </Link>
              </Container>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
