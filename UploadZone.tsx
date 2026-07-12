"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UploadZone() {
  const router = useRouter();
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      setUploading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not signed in.");

        const ext = file.name.split(".").pop();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("atlas-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const dims = await getImageDimensions(file);

        const { data: row, error: dbError } = await supabase
          .from("images")
          .insert({
            user_id: user.id,
            storage_path: path,
            width: dims.width,
            height: dims.height,
            original_name: file.name,
          })
          .select()
          .single();
        if (dbError) throw dbError;

        router.push(`/editor/${row.id}`);
      } catch (err: any) {
        setError(err.message ?? "Upload failed. Try again.");
        setUploading(false);
      }
    },
    [router, supabase]
  );

  function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = URL.createObjectURL(file);
    });
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
            <p className="text-sm text-mist-400">Uploading…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-graphite-800 border border-graphite-600 flex items-center justify-center mb-4">
              <UploadCloud size={22} className="text-signal-soft" />
            </div>
            <p className="font-medium mb-1">Drop an image, or click to browse</p>
            <p className="text-sm text-mist-400">PNG or JPG, up to 10MB</p>
          </>
        )}
      </div>
      {error && (
        <p className="mt-3 text-sm text-coral text-center">{error}</p>
      )}
    </div>
  );
}
