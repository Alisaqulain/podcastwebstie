import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AmbientClip } from "@/lib/youtube-ambient";
import { AmbientVideoBackdrop, type AmbientVideoVariant } from "./ambient-video-backdrop";

type Props = {
  clips: AmbientClip[];
  variant: AmbientVideoVariant;
  startOffset?: number;
  className?: string;
  id?: string;
  /** Content sits above ambient layer */
  children: ReactNode;
};

export function AmbientSectionShell({
  clips,
  variant,
  startOffset,
  className,
  id,
  children,
}: Props) {
  return (
    <section id={id} className={cn("relative isolate overflow-hidden", className)}>
      <AmbientVideoBackdrop
        clips={clips}
        variant={variant}
        startOffset={startOffset}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
