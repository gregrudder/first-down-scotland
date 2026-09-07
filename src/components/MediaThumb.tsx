"use client";

import Image from "next/image";
import { useState } from "react";
import { isAllowedNewsImageHost } from "@/lib/news-image";

function BrandPlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-navy-3 via-navy-2 to-navy"
      aria-hidden
    >
      <div className="field-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/15 via-transparent to-transparent" />
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="absolute bottom-3 left-3 h-9 w-9 rounded-md opacity-80"
      />
    </div>
  );
}

export function MediaThumb({
  src,
  fallbackSrc,
  alt,
  rounded = "none",
}: {
  src: string | null | undefined;
  fallbackSrc?: string | null;
  alt: string;
  rounded?: "none" | "full";
}) {
  const [failedPrimary, setFailedPrimary] = useState(false);
  const [failedFallback, setFailedFallback] = useState(false);

  const primary = !failedPrimary && src ? src : null;
  const fallback = !failedFallback && fallbackSrc && fallbackSrc !== src ? fallbackSrc : null;
  const active = primary ?? fallback;

  return (
    <div
      className={`relative aspect-square overflow-hidden bg-navy-3 sm:aspect-auto sm:h-full sm:min-h-[9.5rem] sm:w-36 sm:shrink-0 ${
        rounded === "full" ? "sm:w-32" : ""
      }`}
    >
      {active ? (
        isAllowedNewsImageHost(active) ? (
          <Image
            src={active}
            alt={alt}
            fill
            sizes="(min-width: 640px) 9rem, 100vw"
            className={`object-cover ${rounded === "full" ? "sm:object-contain sm:p-4" : ""}`}
            referrerPolicy="no-referrer"
            onError={() => {
              if (primary) setFailedPrimary(true);
              else setFailedFallback(true);
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => {
              if (primary) setFailedPrimary(true);
              else setFailedFallback(true);
            }}
          />
        )
      ) : (
        <BrandPlaceholder />
      )}
    </div>
  );
}
