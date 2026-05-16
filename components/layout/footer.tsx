"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconVideo,
  IconLinkedin,
  IconInstagram,
  IconFacebook,
} from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";
import { SiteLogo } from "@/components/brand/site-logo";

const social = [
  { href: SITE.social.youtube, icon: IconVideo, label: "YouTube" },
  { href: SITE.social.linkedin, icon: IconLinkedin, label: "LinkedIn" },
  { href: SITE.social.instagram, icon: IconInstagram, label: "Instagram" },
  { href: SITE.social.facebook, icon: IconFacebook, label: "Facebook" },
];

const linkClass =
  "text-luxury-body transition-colors hover:text-luxury-heading focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold rounded-sm";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-luxury-border bg-muted">
      <Container className="py-16 sm:py-20 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
        <div className="flex flex-col gap-12 md:flex-row md:flex-wrap md:items-start md:justify-between lg:flex-nowrap">
          <div className="max-w-md">
            <div className="flex items-center">
              <span className="logo-pill inline-flex rounded-full bg-white p-3 ring-1 ring-slate-200/90">
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
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/book" className={linkClass}>
                  Book &amp; pay
                </Link>
              </li>
              <li>
                <Link href="/podcast" className={linkClass}>
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold-deep">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/privacy-policy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkClass}>
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className={linkClass}>
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
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-luxury-border bg-surface text-luxury-body shadow-sm transition hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-brand-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <a
              href={SITE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-brand-gold-deep transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold rounded-sm"
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