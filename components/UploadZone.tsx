"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import { fileToDataUrl, saveImage, StoredImage } from "@/lib/local-store";
import { generateSampleImages } from "@/lib/demo-data";

export default function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeAndGo = useCallback(
    async (name: string, dataUrl: string) => {
      const record: StoredImage = {
        id: crypto.randomUUID(),
        name,
        originalDataUrl: dataUrl,
        resultDataUrl: null,
        lastInstruction: null,
        createdAt: Date.now(),
      };
      await saveImage(record);
      router.push(`/editor?id=${record.id}`);
    },
    [router]
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError("For this browser-only demo, please use images under 8MB.");
        return;
      }
      setUploading(true);
      setError(null);
      try {
        const dataUrl = await fileToDataUrl(file);
        await storeAndGo(file.name, dataUrl);
      } catch (err: any) {
        setError(err.message ?? "Upload failed. Try again.");
        setUploading(false);
      }
    },
    [storeAndGo]
  );

  async function handleSample() {
    setUploading(true);
    const [sample] = generateSampleImages();
    await storeAndGo(sample.name, sample.dataUrl);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`atlas-grid cursor-pointer rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center py-16 px-6 ${
          dragOver
            ? "border-signal bg-signal/5"
            : "border-graphite-700 hover:border-graphite-600 bg-graphite-900/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {uploading ? (
          <>
            <Loader2 className="animate-spin text-signal-soft mb-3" size={28} />
            <p className="text-sm text-mist-400">Saving to this browser…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-graphite-800 border border-graphite-600 flex items-center justify-center mb-4">
              <UploadCloud size={22} className="text-signal-soft" />
            </div>
            <p className="font-medium mb-1">Drop an image, or click to browse</p>
            <p className="text-sm text-mist-400">
              PNG or JPG, up to 8MB — stored only in this browser
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-coral text-center">{error}</p>}

      <div className="mt-4 flex items-center justify-center">
        <button
          onClick={handleSample}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100 border border-graphite-700 hover:border-graphite-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
        >
          <Sparkles size={13} className="text-signal-soft" />
          No image handy? Use a generated sample
        </button>
      </div>
    </div>
  );
}
