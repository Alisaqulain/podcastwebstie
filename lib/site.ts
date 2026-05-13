export const SITE = {
  name: "BhawnaMrata",
  tagline: "Stories That Inspire Millions",
  description:
    "A premium podcast & media platform for cinematic interviews—helping founders, creators, and leaders build trust, authority, and reach through conversations that move people.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  /** Optional full-screen hero video (mp4 URL or path like /hero.mp4). Leave empty for gradient-only hero. */
  heroVideoUrl: (process.env.NEXT_PUBLIC_HERO_VIDEO_URL || "").trim(),
  /** Poster shown before video loads or if video errors */
  heroPosterUrl: (process.env.NEXT_PUBLIC_HERO_POSTER_URL || "").trim() || "/logo.png",
  /**
   * Extra zoom on hero YouTube embed so the frame **covers** the viewport (true landscape crop).
   * Long-form landscape uploads need less aggressive scale than Shorts — default ~1.1; override via env.
   */
  heroVideoCoverScale: (() => {
    const raw = process.env.NEXT_PUBLIC_HERO_VIDEO_COVER_SCALE?.trim();
    const n = raw ? Number.parseFloat(raw) : 1.1;
    const v = Number.isFinite(n) ? n : 1.1;
    return Math.min(1.65, Math.max(1, v));
  })(),
  /** Public inquiries; replace with your live inbox if different */
  contactEmail: "hello@bhawnamrata.com",
  /** Optional Calendly embed URL, e.g. https://calendly.com/your-handle/discovery-call */
  calendlyUrl: (process.env.NEXT_PUBLIC_CALENDLY_URL || "").trim(),
  social: {
    youtube: "https://youtube.com/@bhawnamrata",
    linkedin:
      "https://www.linkedin.com/in/namrata-tiwary-singh-47a29487",
    instagram: "https://www.instagram.com/bhawnamrata",
    facebook: "https://www.facebook.com/share/1G1NX29pou/",
    whatsapp: "https://wa.me/919243122115",
  },
};
