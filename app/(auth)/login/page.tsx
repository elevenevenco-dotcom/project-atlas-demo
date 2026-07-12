"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logIn, startInstantDemo } from "@/lib/local-auth";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    logIn(email);
    router.push("/dashboard");
  }

  function handleInstantDemo() {
    startInstantDemo();
    router.push("/dashboard");
  }

  return (
    <div>
      <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-mist-400 mb-6">
        Demo mode — enter any email, no password needed. Your session lives
        only in this browser.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-mist-400 mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-graphite-800 border border-graphite-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-signal-soft disabled:opacity-60 transition-colors rounded-lg py-2.5 text-sm font-medium shadow-glow"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Continue
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-graphite-700 flex-1" />
        <span className="text-xs text-mist-400">or</span>
        <div className="h-px bg-graphite-700 flex-1" />
      </div>

      <button
        onClick={handleInstantDemo}
        className="w-full flex items-center justify-center gap-2 border border-graphite-600 hover:border-signal/50 hover:text-signal-soft transition-colors rounded-lg py-2.5 text-sm font-medium"
      >
        <Zap size={15} /> Skip login, try instant demo
      </button>

      <p className="mt-6 text-center text-sm text-mist-400">
        New here?{" "}
        <Link href="/signup" className="text-signal-soft hover:underline">
          Create a demo profile
        </Link>
      </p>
    </div>
  );
}
