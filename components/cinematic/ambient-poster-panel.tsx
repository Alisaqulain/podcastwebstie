import Image from "next/image";
import { cn } from "@/lib/utils";
import { youtubePosterSrc } from "@/lib/youtube-ambient";

type Props = {
  videoId: string;
  title?: string;
  className?: string;
  priority?: boolean;
};

/** Instant decorative still — no YouTube iframe, no layout shift. */
export function AmbientPosterPanel({
  videoId,
  title = "",
  className,
  priority = false,
}: Props) {
  return (
    <div
      className={cn(
        "relative hidden overflow-hidden rounded-[2rem] ring-1 ring-[color:var(--overlay-ring)] shadow-luxury-card lg:block",
        "aspect-[4/5] w-full max-w-[360px] justify-self-end",
        className
      )}
      aria-hidden={!title}
    >
      <Image
        src={youtubePosterSrc(videoId, "hq")}
        alt={title ? `${title} — podcast still` : ""}
        fill
        sizes="(min-width: 1024px) 360px, 0px"
        className="object-cover object-center"
        priority={priority}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-[color:var(--ambient-scrim-top)] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[color:var(--overlay-ring)]" />
    </div>
  );
}
