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
    <footer className="border-t border-brand-gold/15 bg-brand-dark text-brand-cream">
      <Container className="py-12 sm:py-14 pb-[max(3rem,calc(env(safe-area-inset-bottom,0px)+2rem))]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center">
              <SiteLogo
                variant="footer"
                className="object-left brightness-[1.08]"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brand-cream/75">
              {SITE.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-brand-cream/80">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="hover:text-white">
                  Podcast
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
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
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-brand-cream transition hover:border-brand-gold/50 hover:bg-brand-gold/15 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <a
              href={SITE.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-brand-gold hover:underline"
            >
              WhatsApp Namrata
            </a>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-brand-cream/50">
          © {new Date().getFullYear()} {SITE.name}. Crafted with intention.
        </p>
      </Container>
    </footer>
  );
}
