"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { SiteLogo } from "@/components/brand/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/podcast", label: "Podcast" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
            className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
          />
        ) : null}
      </AnimatePresence>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-luxury-border bg-surface/95 pt-[env(safe-area-inset-top,0px)] text-luxury-heading shadow-sm backdrop-blur-md transition-all duration-300 dark:bg-luxury-bg/95",
          scrolled ? "py-1.5 shadow-soft-xl sm:py-2" : "py-2 sm:py-3 lg:py-4"
        )}
      >
        <Container className="flex items-center justify-between gap-2 sm:gap-4">
          <motion.div
            className="min-w-0 flex-1"
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="group inline-flex max-w-full items-center gap-3"
              onClick={closeMenu}
            >
              <SiteLogo variant="nav" priority={pathname === "/"} />
            </Link>
          </motion.div>

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
                    "relative rounded-full px-3 py-2.5 text-sm font-medium transition-colors xl:px-3.5",
                    active
                      ? "text-luxury-heading"
                      : "text-luxury-body hover:text-luxury-heading"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-gold/12 ring-1 ring-brand-gold/35"
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

          <motion.div
            className="hidden shrink-0 items-center gap-2 lg:flex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThemeToggle />
            <Button href="/book" size="sm">
              Book a Session
            </Button>
          </motion.div>

          <motion.div
            className="flex shrink-0 items-center gap-2 lg:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle className="h-11 w-11" />
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-luxury-border bg-surface p-2.5 text-luxury-heading shadow-sm transition hover:border-brand-gold/40 hover:bg-muted"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </motion.div>
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
              className="overflow-hidden border-t border-luxury-border bg-surface shadow-soft-xl lg:hidden"
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
                            "flex min-h-12 items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                            active
                              ? "bg-brand-gold/12 text-luxury-heading ring-1 ring-brand-gold/40"
                              : "text-luxury-body hover:bg-muted hover:text-luxury-heading"
                          )}
                          onClick={closeMenu}
                        >
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Button
                  href="/book"
                  className="mt-3 w-full"
                  onClick={closeMenu}
                >
                  Book a Session
                </Button>
              </Container>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
