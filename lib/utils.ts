import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Converts a pixel click position inside a rendered image element to
// normalized 0-1 coordinates, so markers stay correctly positioned
// regardless of the image's displayed size.
export function toNormalizedPosition(
  clientX: number,
  clientY: number,
  rect: DOMRect
) {
  const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  return { x, y };
}
