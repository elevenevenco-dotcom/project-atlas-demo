"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { getSession, upgradeToPro, downgradeToFree, LocalUser } from "@/lib/local-auth";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  function handleUpgrade() {
    if (!user) {
      router.push("/signup");
      return;
    }
    const updated = upgradeToPro();
    setUser(updated);
  }

  function handleDowngrade() {
    const updated = downgradeToFree();
    setUser(updated);
  }

  return (
    <main className="min-h-screen bg-graphite-950 text-mist-100 atlas-grid">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-signal flex items-center justify-center">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Atlas
          </span>
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight mb-3">
          Simple, usage-based pricing
        </h1>
        <p className="text-mist-400 max-w-lg mx-auto mb-3">
          Start free. Upgrade when you need more edits per month.
        </p>
        <p className="text-xs font-mono text-signal-soft mb-14">
          Demo mode — "Upgrade" just flips a flag stored in this browser. No
          card, no Stripe, no charge.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
          {/* Free */}
          <div className="border border-graphite-700 rounded-2xl p-8 bg-graphite-900/60">
            <h2 className="font-display font-semibold text-lg mb-1">Free</h2>
            <p className="text-sm text-mist-400 mb-6">For trying Atlas out.</p>
            <div className="font-display text-4xl font-semibold mb-6">
              $0<span className="text-base text-mist-400 font-body">/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {[
                "5 simulated edits per month",
                "Standard resolution output",
                "Point-based marker editing",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-mist-100">
                  <Check size={15} className="text-signal-soft shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {user?.plan === "pro" ? (
              <button
                onClick={handleDowngrade}
                className="block w-full text-center border border-graphite-600 hover:border-graphite-500 rounded-lg py-2.5 text-sm font-medium transition-colors"
              >
                Switch back to Free
              </button>
            ) : (
              <Link
                href="/signup"
                className="block text-center border border-graphite-600 hover:border-graphite-500 rounded-lg py-2.5 text-sm font-medium transition-colors"
              >
                {user ? "You're on Free" : "Start for free"}
              </Link>
            )}
          </div>

          {/* Pro */}
          <div className="border border-signal/40 rounded-2xl p-8 bg-graphite-900 shadow-glow relative">
            <span className="absolute -top-3 left-8 bg-signal text-xs font-medium px-3 py-1 rounded-full">
              Most popular
            </span>
            <h2 className="font-display font-semibold text-lg mb-1">Pro</h2>
            <p className="text-sm text-mist-400 mb-6">
              For regular creative and product work.
            </p>
            <div className="font-display text-4xl font-semibold mb-6">
              $19<span className="text-base text-mist-400 font-body">/mo</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm">
              {[
                "200 simulated edits per month",
                "High resolution output",
                "Priority in this demo (instant either way)",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-mist-100">
                  <Check size={15} className="text-signal-soft shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={user?.plan === "pro"}
              className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-signal-soft disabled:opacity-60 rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {user?.plan === "pro" ? "You're on Pro" : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
