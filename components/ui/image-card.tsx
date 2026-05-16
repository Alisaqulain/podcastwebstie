"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { optimizeMediaSrc } from "@/lib/media-url";

export type ImageCardType = "podcast" | "blog" | "testimonial";

type ImageCardStatus = "empty" | "loading" | "loaded" | "error";

export type ImageCardProps = {
  src?: string | null;
  alt: string;
  type: ImageCardType;
  /** 1:1 square cards vs circular profile (testimonial photos only). */
  testimonialShape?: "square" | "circle";
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /**
   * Stronger bottom blur + dark gradient for copy placed over the image (e.g. article hero).
   */
  textSafeOverlay?: boolean;
  /** Extra overlay content (e.g. play control) — rendered above brand/hover layers. */
  children?: React.ReactNode;
};

const aspectByType: Record<ImageCardType, string> = {
  podcast: "aspect-video",
  blog: "aspect-video",
  testimonial: "aspect-square",
};

const defaultSizesByType = (
  type: ImageCardType,
  shape: "square" | "circle"
): string => {
  if (type === "testimonial") {
    return shape === "circle" ? "96px" : "(max-width: 768px) 50vw, 200px";
  }
  return "(max-width: 768px) 100vw, 896px";
};

function ElegantPlaceholder({ type }: { type: ImageCardType }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-cream via-brand-gold-light/25 to-brand-gold/15 px-6 text-center"
      aria-hidden
    >
      <Sparkles className="h-8 w-8 text-brand-gold-deep/50" strokeWidth={1.25} />
      <p className="font-display text-sm font-medium text-brand-dark/45">
        {type === "podcast" && "Episode artwork"}
        {type === "blog" && "Article cover"}
        {type === "testimonial" && "Portrait"}
      </p>
    </div>
  );
}

export function ImageCard({
  src,
  alt,
  type,
  testimonialShape = "square",
  className,
  imgClassName,
  priority = false,
  sizes,
  textSafeOverlay = false,
  children,
}: ImageCardProps) {
  const trimmed = src?.trim() ?? "";
  const [status, setStatus] = useState<ImageCardStatus>(() =>
    trimmed ? "loading" : "empty"
  );

  useEffect(() => {
    const next = src?.trim() ?? "";
    setStatus(next ? "loading" : "empty");
  }, [src]);

  const isCircle = type === "testimonial" && testimonialShape === "circle";
  const showPlaceholder = status === "empty" || status === "error";
  const optimized =
    trimmed && !showPlaceholder ? optimizeMediaSrc(trimmed) : "";

  const defaultSizes = defaultSizesByType(type, testimonialShape);

  return (
    <div
      className={cn(
        "group/image relative overflow-hidden bg-brand-cream/50 shadow-card",
        "rounded-2xl",
        isCircle && "!rounded-full",
        aspectByType[type],
        className
      )}
    >
      {showPlaceholder ? <ElegantPlaceholder type={type} /> : null}

      {trimmed && !showPlaceholder ? (
        <>
          {status === "loading" ? (
            <div
              className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-luxury-section via-luxury-bg to-brand-gold/10"
              aria-hidden
            />
          ) : null}
          <Image
            src={optimized}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes ?? defaultSizes}
            className={cn(
              "object-cover transition duration-500 ease-out will-change-transform",
              "group-hover/image:scale-[1.04]",
              status === "loading" ? "opacity-0" : "opacity-100",
              imgClassName
            )}
            onLoadingComplete={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        </>
      ) : null}

      {/* Brand warmth — always on */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(201,161,74,0.15)]"
        aria-hidden
      />

      {/* Readability: blur + dark gradient when text may sit on the image */}
      {type !== "testimonial" && textSafeOverlay ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[48%] bg-gradient-to-t from-brand-dark/60 via-brand-dark/25 to-transparent opacity-90 backdrop-blur-[3px] transition duration-300 group-hover/image:opacity-100"
          aria-hidden
        />
      ) : null}

      {/* Hover: gold gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-brand-gold/20 via-transparent to-brand-gold-deep/15 opacity-0 transition duration-300 group-hover/image:opacity-100"
        aria-hidden
      />

      {children ? <div className="absolute inset-0 z-[4]">{children}</div> : null}
    </div>
  );
}
