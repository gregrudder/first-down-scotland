"use client";

import Image from "next/image";
import { useState } from "react";
import { isAllowedNewsImageHost } from "@/lib/news-image";

function NewsImagePlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-navy-3 via-navy-2 to-navy"
      aria-hidden
    >
      <div className="field-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gold/15 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold/80">
        1D
      </span>
    </div>
  );
}

export function NewsThumb({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="relative aspect-[16/9] overflow-hidden bg-navy-3 sm:aspect-auto sm:h-full sm:min-h-[9.5rem] sm:w-52 sm:shrink-0">
      {showImage && src ? (
        isAllowedNewsImageHost(src) ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 640px) 13rem, 100vw"
            className="object-cover"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        ) : (
          // Feed CDNs we have not allow-listed yet — lazy load, no referrer.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )
      ) : (
        <NewsImagePlaceholder />
      )}
    </div>
  );
}
