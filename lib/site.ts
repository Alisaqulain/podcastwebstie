export const SITE = {
  name: "BHAW Namrata",
  tagline: "Expression is Power",
  description:
    "Founder and Host of the BHAW Namrata Podcast, where real conversations inspire women to build confidence, clarity, and self-belief.",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  social: {
    youtube: "https://youtube.com/@bhawnamrata",
    linkedin:
      "https://www.linkedin.com/in/namrata-tiwary-singh-47a29487",
    instagram: "https://www.instagram.com/bhawnamrata",
    facebook: "https://www.facebook.com/share/1G1NX29pou/",
    whatsapp: "https://wa.me/919243122115",
  },
} as const;
