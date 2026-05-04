import type { PackagePublic } from "@/components/booking/booking-experience";
import packagesSeed from "@/data/packages-seed.json";

/** Stable demo ids when MongoDB is off or collection is empty — not ObjectIds; booking requires seeded DB. */
const DEMO_IDS = [
  "demo-package-discovery",
  "demo-package-intensive",
  "demo-package-3pack",
];

/**
 * Public package rows for marketing / UI when `getDb()` is null or `packages` has no active rows.
 * For real bookings and payments, set `MONGODB_URI` and run `npm run seed:packages`.
 */
export function getSeedPackagesPublic(): PackagePublic[] {
  return packagesSeed.map((p, i) => ({
    _id: DEMO_IDS[i] ?? `demo-package-${i}`,
    title: p.title,
    description: p.description,
    price: p.price,
    discountPrice: p.discountPrice,
    features: p.features,
    badge: p.badge || undefined,
    active: p.active !== false,
  }));
}
