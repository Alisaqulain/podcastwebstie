const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Namrata Tiwary Singh",
    alternateName: "BhawnaMrata",
    url: siteUrl,
    jobTitle: ["Podcaster", "Self Image Coach", "Speaker", "Founder"],
    sameAs: [
      "https://youtube.com/@bhawnamrata",
      "https://www.linkedin.com/in/namrata-tiwary-singh-47a29487",
      "https://www.instagram.com/bhawnamrata",
      "https://www.facebook.com/share/1G1NX29pou/",
    ],
    knowsAbout: ["Self-image coaching", "Women's empowerment", "Podcasting"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PodcastSeriesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "BhawnaMrata Podcast",
    url: `${siteUrl}/podcast`,
    author: {
      "@type": "Person",
      name: "Namrata Tiwary Singh",
    },
    description:
      "Real conversations that inspire women to build confidence, clarity, and self-belief.",
    webFeedElement: "https://youtube.com/@bhawnamrata",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
