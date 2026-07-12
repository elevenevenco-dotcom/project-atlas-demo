"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageIcon, Trash2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import { getAllImages, deleteImage, StoredImage } from "@/lib/local-store";

export default function DashboardPage() {
  const [images, setImages] = useState<StoredImage[] | null>(null);

  async function refresh() {
    setImages(await getAllImages());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthGuard>
      {(user) => (
        <div className="min-h-screen bg-graphite-950 text-mist-100 flex flex-col">
          <Navbar user={user} />

          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-semibold tracking-tight mb-1">
                Your images
              </h1>
              <p className="text-sm text-mist-400">
                Stored locally in this browser via IndexedDB — nothing is
                uploaded anywhere, {user.name}.
              </p>
            </div>

            <div className="mb-12">
              <UploadZone />
            </div>

            {images === null ? (
              <div className="text-center py-16 text-mist-400 text-sm">
                Loading…
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-16 text-mist-400">
                <ImageIcon className="mx-auto mb-3 opacity-40" size={28} />
                <p className="text-sm">No images yet. Upload one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden border border-graphite-700 bg-graphite-900 hover:border-signal/50 transition-colors"
                  >
                    <Link href={`/editor?id=${img.id}`}>
                      <div className="aspect-square overflow-hidden bg-graphite-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.resultDataUrl ?? img.originalDataUrl}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs truncate text-mist-400">{img.name}</p>
                      </div>
                    </Link>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        await deleteImage(img.id);
                        refresh();
                      }}
                      className="absolute top-2 right-2 bg-graphite-950/80 border border-graphite-700 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-coral"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </AuthGuard>
  );
}
