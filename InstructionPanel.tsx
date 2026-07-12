"use client";

import { Sparkles, Loader2, MapPin } from "lucide-react";

export default function InstructionPanel({
  hasMarker,
  instruction,
  onInstructionChange,
  onSubmit,
  loading,
  disabled,
}: {
  hasMarker: boolean;
  instruction: string;
  onInstructionChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  const examples = [
    "Add a leather patch here",
    "Turn this into a wood texture",
    "Remove this object",
    "Add a small embroidered logo",
  ];

  return (
    <div className="w-full lg:w-80 shrink-0 border border-graphite-700 bg-graphite-900/60 rounded-xl p-5 flex flex-col gap-4 h-fit">
      <div>
        <h2 className="font-display font-medium text-sm mb-1 flex items-center gap-2">
          <Sparkles size={15} className="text-signal-soft" />
          Instruction
        </h2>
        <p className="text-xs text-mist-400 leading-relaxed">
          {hasMarker
            ? "Describe the change to make at the marked point."
            : "Click anywhere on the image to place a marker first."}
        </p>
      </div>

      <textarea
        value={instruction}
        onChange={(e) => onInstructionChange(e.target.value)}
        disabled={!hasMarker || disabled}
        rows={4}
        placeholder='e.g. "Place a leather patch here"'
        className="w-full resize-none bg-graphite-800 border border-graphite-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal disabled:opacity-50"
      />

      <div className="flex flex-wrap gap-1.5">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={!hasMarker || disabled}
            onClick={() => onInstructionChange(ex)}
            className="text-xs px-2.5 py-1 rounded-full border border-graphite-600 text-mist-400 hover:text-mist-100 hover:border-graphite-500 transition-colors disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={!hasMarker || !instruction.trim() || loading || disabled}
        className="mt-1 w-full flex items-center justify-center gap-2 bg-signal hover:bg-signal-soft disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg py-2.5 text-sm font-medium shadow-glow"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Generating edit…
          </>
        ) : (
          <>
            <MapPin size={16} /> Apply edit
          </>
        )}
      </button>
    </div>
  );
}
