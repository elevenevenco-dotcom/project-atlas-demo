import Link from "next/link";
import { MapPin, Crosshair, Wand2, Download, ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-graphite-950 text-mist-100 overflow-hidden">
      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-signal flex items-center justify-center">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Atlas
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-mist-400 border border-graphite-700 rounded px-1.5 py-0.5 ml-1">
            Demo
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-mist-400">
          <a href="#how" className="hover:text-mist-100 transition-colors">
            How it works
          </a>
          <Link href="/pricing" className="hover:text-mist-100 transition-colors">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-mist-400 hover:text-mist-100 transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-signal hover:bg-signal-soft transition-colors px-4 py-2 rounded-lg shadow-glow"
          >
            Try the demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative atlas-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite-950/0 via-graphite-950/40 to-graphite-950 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-signal-soft border border-signal/30 rounded-full px-3 py-1 mb-6">
              <ShieldCheck size={12} /> Runs entirely in your browser
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-mist-100">
              Don't describe the whole image.
              <br />
              <span className="text-signal-soft">Just point at the part</span>{" "}
              that changes.
            </h1>
            <p className="mt-6 text-lg text-mist-400 max-w-lg leading-relaxed">
              This is a fully self-contained demo of Atlas: upload a photo,
              click exactly where you want a change, describe it, and see a
              simulated edit rendered on the spot — no account server, no
              database, no AI API. Everything stays on this device.
            </p>
            <div className="mt-9 flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-signal hover:bg-signal-soft transition-colors px-6 py-3.5 rounded-xl font-medium shadow-glow"
              >
                Open the editor <ArrowRight size={18} />
              </Link>
              <Link
                href="/pricing"
                className="text-mist-400 hover:text-mist-100 transition-colors px-4 py-3.5 text-sm font-medium"
              >
                See pricing →
              </Link>
            </div>
          </div>

          {/* Signature element: mock canvas showing click → marker → instruction bubble */}
          <div className="relative">
            <div className="relative rounded-2xl border border-graphite-700 bg-graphite-900 shadow-panel p-3">
              <div className="flex items-center gap-1.5 px-2 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-coral/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-signal-soft/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-mist-400/40" />
                <span className="ml-3 text-xs font-mono text-mist-400">
                  jacket-final.png
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-graphite-800 to-graphite-700 aspect-[4/3]">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, rgba(245,245,247,0.05) 0px, rgba(245,245,247,0.05) 2px, transparent 2px, transparent 14px)",
                  }}
                />
                <div className="absolute" style={{ left: "62%", top: "58%" }}>
                  <span className="absolute -inset-3 rounded-full bg-signal/30 animate-pulseMarker" />
                  <span className="relative block w-4 h-4 rounded-full bg-signal border-2 border-mist-100 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="absolute left-[40%] top-[20%] max-w-[220px] bg-graphite-900/95 border border-graphite-600 rounded-lg rounded-bl-none px-3 py-2 text-xs shadow-panel">
                  <span className="text-signal-soft font-mono">→ </span>
                  Add a tan leather patch on the elbow
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-graphite-900 border border-graphite-700 rounded-xl px-4 py-3 shadow-panel hidden sm:flex items-center gap-2">
              <Wand2 size={16} className="text-signal-soft" />
              <span className="text-xs font-medium">Simulated in-browser</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's simulated */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-6">
        <div className="border border-graphite-700 bg-graphite-900/60 rounded-xl p-5 text-sm text-mist-400 leading-relaxed">
          <strong className="text-mist-100">What's real vs. simulated:</strong>{" "}
          uploading, marker placement, and the click → instruction UI are
          fully functional. Sign-in is a local profile stored on this
          device — no server checks a password. Images live in this
          browser's IndexedDB — nothing is sent anywhere. The "AI edit" is a
          canvas effect chosen from keywords in your instruction, so the
          loop is demonstrable offline; swapping in a real model is a single
          function to replace.
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-2">
          Four steps, one precise edit
        </h2>
        <p className="text-mist-400 mb-14 max-w-xl">
          No masks to paint, no prompts that have to describe the entire
          scene — just point and say what changes.
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: <Download size={18} className="rotate-180" />,
              title: "Upload",
              body: "Drop in a photo, or use a generated sample — stored only in this browser.",
            },
            {
              icon: <Crosshair size={18} />,
              title: "Point",
              body: "Click the exact spot on the image where the change happens.",
            },
            {
              icon: <Wand2 size={18} />,
              title: "Describe",
              body: "Type a short instruction, like \"add a leather patch here.\"",
            },
            {
              icon: <Download size={18} />,
              title: "Download",
              body: "Atlas renders a simulated edit, ready to export.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="border border-graphite-700 rounded-xl p-5 bg-graphite-900/60"
            >
              <div className="w-9 h-9 rounded-lg bg-graphite-800 border border-graphite-600 flex items-center justify-center text-signal-soft mb-4">
                {step.icon}
              </div>
              <h3 className="font-display font-medium mb-1.5">{step.title}</h3>
              <p className="text-sm text-mist-400 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-graphite-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between text-sm text-mist-400">
          <span>© {new Date().getFullYear()} Project Atlas — demo build</span>
          <Link href="/pricing" className="hover:text-mist-100">
            Pricing
          </Link>
        </div>
      </footer>
    </main>
  );
}
