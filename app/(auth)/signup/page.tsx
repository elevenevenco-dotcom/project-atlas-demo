"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/local-auth";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    signUp(fullName, email);
    router.push("/dashboard");
  }

  return (
    <div>
      <h1 className="font-display text-xl font-semibold mb-1">
        Create your demo profile
      </h1>
      <p className="text-sm text-mist-400 mb-6">
        Nothing leaves your browser — no account is created on a server.
        Free plan includes 5 simulated edits.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-mist-400 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-graphite-800 border border-graphite-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/50 focus:border-signal"
            placeholder="Ada Lovelace"
          />
        </div>
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
          Create demo profile
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-mist-400">
        Already have one?{" "}
        <Link href="/login" className="text-signal-soft hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
