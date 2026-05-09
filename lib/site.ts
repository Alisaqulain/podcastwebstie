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
