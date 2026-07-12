"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Canvas, { MarkerPosition } from "@/components/Canvas";
import InstructionPanel from "@/components/InstructionPanel";
import { getImage, saveImage, StoredImage } from "@/lib/local-store";
import { useCredit, LocalUser } from "@/lib/local-auth";
import { runFakeEdit } from "@/lib/fake-ai-edit";

export default function EditorPage() {
  return (
    <Suspense fallback={null}>
      <AuthGuard>{(user) => <EditorContent user={user} />}</AuthGuard>
    </Suspense>
  );
}

function EditorContent({ user }: { user: LocalUser }) {
  const creditsRemaining = user.credits;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [image, setImage] = useState<StoredImage | null | "loading">("loading");
  const [marker, setMarker] = useState<MarkerPosition>(null);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [outOfCredits, setOutOfCredits] = useState(creditsRemaining <= 0);

  useEffect(() => {
    if (!id) {
      setImage(null);
      return;
    }
    getImage(id).then((img) => {
      setImage(img ?? null);
      if (img?.resultDataUrl) setResultUrl(img.resultDataUrl);
      if (img?.lastInstruction) setInstruction(img.lastInstruction);
    });
  }, [id]);

  async function handleSubmit() {
    if (!marker || !instruction.trim() || !image || image === "loading") return;
    setLoading(true);
    setError(null);

    try {
      const updatedUser = useCredit();
      if (!updatedUser || updatedUser.credits < 0) {
        setOutOfCredits(true);
        throw new Error("You're out of edits for this period.");
      }

      const edited = await runFakeEdit(image.originalDataUrl, marker, instruction.trim());
      const updatedImage: StoredImage = {
        ...image,
        resultDataUrl: edited,
        lastInstruction: instruction.trim(),
      };
      await saveImage(updatedImage);
      setImage(updatedImage);
      setResultUrl(edited);
    } catch (err: any) {
      setError(err.message ?? "Edit failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-graphite-950 text-mist-100 flex flex-col">
      <Navbar user={user} />

          <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
            {image === "loading" ? (
              <div className="flex items-center justify-center py-24 text-mist-400">
                <Loader2 className="animate-spin mr-2" size={18} /> Loading image…
              </div>
            ) : image === null ? (
              <div className="text-center py-24 text-mist-400 text-sm">
                Image not found in this browser's storage.{" "}
                <a href="/dashboard" className="text-signal-soft underline">
                  Back to dashboard
                </a>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="font-display text-xl font-semibold tracking-tight">
                      {image.name}
                    </h1>
                    <p className="text-xs text-mist-400 mt-0.5">
                      {resultUrl
                        ? "Showing simulated edit result"
                        : "Click on the image to place a marker"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {resultUrl && (
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          setMarker(null);
                          setInstruction("");
                          saveImage({ ...image, resultDataUrl: null, lastInstruction: null });
                          setImage({ ...image, resultDataUrl: null, lastInstruction: null });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs border border-graphite-600 hover:border-graphite-500 rounded-lg px-3 py-2 text-mist-400 hover:text-mist-100 transition-colors"
                      >
                        <RotateCcw size={13} /> Start new edit
                      </button>
                    )}
                    {resultUrl && (
                      <a
                        href={resultUrl}
                        download={`atlas-demo-edit-${image.id}.png`}
                        className="inline-flex items-center gap-1.5 text-xs bg-signal hover:bg-signal-soft rounded-lg px-3 py-2 font-medium shadow-glow"
                      >
                        <Download size={13} /> Download
                      </a>
                    )}
                  </div>
                </div>

                {outOfCredits && (
                  <div className="mb-6 flex items-center gap-2 text-sm bg-coral/10 border border-coral/30 text-coral rounded-lg px-4 py-3">
                    <AlertCircle size={16} />
                    You're out of edits for this period.{" "}
                    <a href="/pricing" className="underline font-medium">
                      Upgrade to Pro
                    </a>{" "}
                    (still simulated — no payment required in this demo).
                  </div>
                )}

                {error && (
                  <div className="mb-6 text-sm bg-coral/10 border border-coral/30 text-coral rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-1 flex justify-center">
                    <Canvas
                      imageUrl={resultUrl ?? image.originalDataUrl}
                      marker={resultUrl ? null : marker}
                      onPlaceMarker={(pos) => !resultUrl && setMarker(pos)}
                      disabled={loading || !!resultUrl || outOfCredits}
                    />
                  </div>

                  <InstructionPanel
                    hasMarker={!!marker}
                    instruction={instruction}
                    onInstructionChange={setInstruction}
                    onSubmit={handleSubmit}
                    loading={loading}
                    disabled={!!resultUrl || outOfCredits}
                  />
                </div>
              </>
            )}
      </main>
    </div>
  );
}
