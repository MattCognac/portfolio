"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { PhotoItem } from "@/lib/types";

const LIGHTBOX_SWIPE_THRESHOLD = 48;

function LightboxButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/18"
    >
      {children}
    </button>
  );
}

function PhotoLightbox({
  photo,
  photoIndex,
  totalPhotos,
  onClose,
  onPrevious,
  onNext,
  onTouchStart,
  onTouchEnd,
  onTouchCancel,
}: {
  photo: PhotoItem;
  photoIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLDivElement>) => void;
  onTouchCancel: () => void;
}) {
  const imageClassName =
    "h-full max-h-full w-auto max-w-full object-contain";
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] bg-neutral-950/88 p-4 backdrop-blur-md sm:p-6"
    >
      <button
        type="button"
        aria-label="Close lightbox"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          <p
            id={titleId}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65"
          >
            Photo {photoIndex + 1} / {totalPhotos}
          </p>
          <div className="flex items-center gap-2">
            <LightboxButton label="Previous photo" onClick={onPrevious}>
              Prev
            </LightboxButton>
            <LightboxButton label="Next photo" onClick={onNext}>
              Next
            </LightboxButton>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/18"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-3 flex min-h-0 flex-1">
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/30"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
            <Image
              src={photo.fullSrc}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              className={imageClassName}
              priority
            />

            {photo.story ? (
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center sm:inset-x-5 sm:bottom-5">
                <div className="max-w-2xl rounded-[1.35rem] border border-white/12 bg-black/22 px-4 py-3 text-center text-sm leading-6 text-white/82 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-5">
                  <p>{photo.story}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotographyPanel({ photos }: { photos: PhotoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const showPreviousPhoto = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + photos.length) % photos.length,
    );
  }, [photos.length]);

  const showNextPhoto = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % photos.length,
    );
  }, [photos.length]);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleLightboxTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const touch = event.changedTouches[0];
      if (!touch) return;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    },
    [],
  );

  const handleLightboxTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const startingTouch = touchStartRef.current;
      const endingTouch = event.changedTouches[0];

      touchStartRef.current = null;

      if (!startingTouch || !endingTouch) return;

      const deltaX = endingTouch.clientX - startingTouch.x;
      const deltaY = endingTouch.clientY - startingTouch.y;

      if (
        Math.abs(deltaX) < LIGHTBOX_SWIPE_THRESHOLD ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      ) {
        return;
      }

      if (deltaX > 0) {
        showPreviousPhoto();
        return;
      }

      showNextPhoto();
    },
    [showNextPhoto, showPreviousPhoto],
  );

  const handleLightboxTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        showNextPhoto();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [activeIndex, closeLightbox, showNextPhoto, showPreviousPhoto]);

  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex]);

  if (!photos.length) {
    return (
      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        Add a few photos to preview the gallery here.
      </p>
    );
  }

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <div className="mx-auto max-w-lg columns-2 gap-2.5">
        {photos.map((photo, index) => (
          <button
            key={`${photo.fullSrc}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group mb-2.5 block w-full break-inside-avoid overflow-hidden rounded-[1.15rem] border border-neutral-200/80 bg-white/55 text-left shadow-[0_8px_24px_rgba(0,0,0,0.045)] transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white/75 dark:border-neutral-700/70 dark:bg-neutral-950/45 dark:shadow-[0_8px_24px_rgba(0,0,0,0.28)] dark:hover:border-neutral-600 dark:hover:bg-neutral-900/65"
          >
            <div className="relative overflow-hidden">
              <Image
                src={photo.thumbSrc}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 42vw, 280px"
                className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.015]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      {typeof document !== "undefined" && activePhoto
        ? createPortal(
            <PhotoLightbox
              photo={activePhoto}
              photoIndex={activeIndex ?? 0}
              totalPhotos={photos.length}
              onClose={closeLightbox}
              onPrevious={showPreviousPhoto}
              onNext={showNextPhoto}
              onTouchStart={handleLightboxTouchStart}
              onTouchEnd={handleLightboxTouchEnd}
              onTouchCancel={handleLightboxTouchCancel}
            />,
            document.body,
          )
        : null}
    </>
  );
}
