"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, LogOut, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({
  email,
  plan,
  credits,
}: {
  email?: string;
  plan?: string;
  credits?: number;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="h-14 border-b border-graphite-800 bg-graphite-950/90 backdrop-blur flex items-center justify-between px-4 md:px-6 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-signal flex items-center justify-center">
          <MapPin size={14} strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-sm tracking-tight">
          Atlas
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {typeof credits === "number" && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-mist-400 border border-graphite-700 rounded-full px-3 py-1.5">
            <span className="font-mono">{credits}</span> edits left
            {plan === "free" && (
              <Link
                href="/pricing"
                className="text-signal-soft hover:underline ml-1"
              >
                Upgrade
              </Link>
            )}
          </div>
        )}
        {plan === "pro" && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-signal/15 text-signal-soft border border-signal/30 rounded-full px-3 py-1.5">
            <CreditCard size={12} /> Pro
          </span>
        )}
        <span className="hidden md:inline text-xs text-mist-400">{email}</span>
        <button
          onClick={handleLogout}
          className="text-mist-400 hover:text-mist-100 transition-colors p-2 rounded-lg hover:bg-graphite-800"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
