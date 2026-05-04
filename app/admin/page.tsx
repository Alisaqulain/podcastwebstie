import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { Mic2, FileText, Heart, Inbox, PackageOpen, CalendarRange } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const db = await getDb();
  const [packages, bookings, podcasts, blogs, testimonials, contacts] =
    await Promise.all([
      db ? db.collection("packages").countDocuments() : 0,
      db ? db.collection("bookings").countDocuments() : 0,
      db ? db.collection("podcasts").countDocuments() : 0,
      db ? db.collection("blogs").countDocuments() : 0,
      db ? db.collection("testimonials").countDocuments() : 0,
      db ? db.collection("contacts").countDocuments() : 0,
    ]);

  const cards = [
    {
      label: "Packages",
      count: packages,
      href: "/admin/packages",
      icon: PackageOpen,
    },
    {
      label: "Bookings",
      count: bookings,
      href: "/admin/bookings",
      icon: CalendarRange,
    },
    {
      label: "Podcasts",
      count: podcasts,
      href: "/admin/podcasts",
      icon: Mic2,
    },
    { label: "Blogs", count: blogs, href: "/admin/blogs", icon: FileText },
    {
      label: "Testimonials",
      count: testimonials,
      href: "/admin/testimonials",
      icon: Heart,
    },
    { label: "Contacts", count: contacts, href: "/admin/contacts", icon: Inbox },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-dark">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-brand-dark/65">
        Packages, bookings, podcasts, blogs, testimonials, and inbound messages.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map(({ label, count, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-3xl border border-brand-gold/15 bg-white/70 p-6 shadow-sm transition hover:border-brand-gold/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-brand-gold-deep" />
              <span className="font-display text-3xl font-semibold text-brand-dark">
                {count}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-brand-dark/70">{label}</p>
          </Link>
        ))}
      </div>

      {!db ? (
        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          MongoDB is not connected. Add <code className="font-mono">MONGODB_URI</code>{" "}
          to <code className="font-mono">.env.local</code> to enable the CMS.
        </p>
      ) : null}
    </div>
  );
}
