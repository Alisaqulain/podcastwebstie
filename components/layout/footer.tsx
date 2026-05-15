"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconVideo,
  IconLinkedin,
  IconInstagram,
  IconFacebook,
} from "@/components/icons/social-icons";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";
import { SiteLogo } from "@/components/brand/site-logo";

const social = [
  { href: SITE.social.youtube, icon: IconVideo, label: "YouTube" },
  { href: SITE.social.linkedin, icon: IconLinkedin, label: "LinkedIn" },
  { href: SITE.social.instagram, icon: IconInstagram, label: "Instagram" },
  { href: SITE.social.facebook, icon: IconFacebook, label: "Facebook" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-luxury-border bg-luxury-bg">
      <Container className="py-16 sm:py-20 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
        <div className="flex flex-col gap-12 md:flex-row md:flex-wrap md:items-start md:justify-between lg:flex-nowrap">
          <div className="max-w-md">
            <div className="flex items-center">
              <span className="logo-pill inline-flex rounded-full p-3 shadow-soft-xl ring-1 ring-luxury-border">
                <SiteLogo
                  variant="footer"
                  className="!h-12 object-left sm:!h-14 md:!h-16"
                />
              </span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-luxury-body">
              {SITE.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-luxury-body">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Book &amp; pay
                </Link>
              </li>
              <li>
                <Link
                  href="/podcast"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Podcast
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-luxury-body">
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="transition-colors hover:text-brand-gold-deep"
                >
                  Refund &amp; Cancellation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
              Connect
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {social.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-luxury-border bg-luxury-section text-luxury-body shadow-sm transition hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-brand-gold-deep"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <a
              href={SITE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-brand-gold-deep transition-colors hover:text-brand-gold"
            >
              WhatsApp Namrata
            </a>
          </div>
        </div>

        <p className="mt-14 border-t border-luxury-border pt-8 text-center text-xs text-luxury-muted">
          © {new Date().getFullYear()} {SITE.name}. Crafted with intention.
        </p>
      </Container>
    </footer>
  );
}
