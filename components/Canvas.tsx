"use client";

import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { toNormalizedPosition } from "@/lib/utils";

export type MarkerPosition = { x: number; y: number } | null;

export default function Canvas({
  imageUrl,
  marker,
  onPlaceMarker,
  disabled,
}: {
  imageUrl: string;
  marker: MarkerPosition;
  onPlaceMarker: (pos: { x: number; y: number }) => void;
  disabled?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const pos = toNormalizedPosition(e.clientX, e.clientY, rect);
    onPlaceMarker(pos);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setHover(toNormalizedPosition(e.clientX, e.clientY, rect));
  }

  return (
    <div
      className={`relative inline-block select-none rounded-xl overflow-hidden border border-graphite-700 shadow-panel ${
        disabled ? "" : "crosshair-cursor"
      }`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Uploaded image to edit"
        className="block max-w-full max-h-[70vh] w-auto h-auto"
        draggable={false}
      />

      {/* Hover crosshair preview */}
      {hover && !disabled && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${hover.x * 100}%`,
            top: `${hover.y * 100}%`,
          }}
        >
          <span className="block w-3 h-3 rounded-full border-2 border-mist-100/60 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Placed marker */}
      {marker && (
        <div
          className="absolute pointer-events-none"
          style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }}
        >
          <span className="absolute -inset-3 rounded-full bg-signal/30 animate-pulseMarker -translate-x-1/2 -translate-y-1/2" />
          <span className="absolute -translate-x-1/2 -translate-y-full -mt-1 flex flex-col items-center">
            <MapPin
              size={28}
              className="text-signal drop-shadow-lg"
              fill="#6e5bff"
              strokeWidth={1.5}
            />
          </span>
        </div>
      )}
    </div>
  );
}
