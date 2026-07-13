"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, LogOut, CreditCard, RotateCcw } from "lucide-react";
import { LocalUser, logOut } from "@/lib/local-auth";
import { clearAllImages } from "@/lib/local-store";

export default function Navbar({ user }: { user: LocalUser }) {
  const router = useRouter();

  function handleLogout() {
    logOut();
    router.push("/");
    router.refresh();
  }

  async function handleResetDemo() {
    if (!confirm("This clears every image stored in this browser. Continue?")) return;
    await clearAllImages();
    router.refresh();
  }

  return (
    <header className="h-14 border-b border-graphite-800 bg-graphite-950/90 backdrop-blur flex items-center justify-between px-4 md:px-6 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-signal flex items-center justify-center">
          <MapPin size={14} strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-sm tracking-tight">
          Eleven Even Studio
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-mist-400 border border-graphite-700 rounded px-1.5 py-0.5 ml-1">
          AI Editor
        </span>
      </Link>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-mist-400 border border-graphite-700 rounded-full px-3 py-1.5">
          <span className="font-mono">{user.credits}</span> edits left
          {user.plan === "free" && (
            <Link href="/pricing" className="text-signal-soft hover:underline ml-1">
              Upgrade
            </Link>
          )}
        </div>
        {user.plan === "pro" && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-signal/15 text-signal-soft border border-signal/30 rounded-full px-3 py-1.5">
            <CreditCard size={12} /> Pro
          </span>
        )}
        <span className="hidden md:inline text-xs text-mist-400">{user.email}</span>
        <button
          onClick={handleResetDemo}
          className="text-mist-400 hover:text-mist-100 transition-colors p-2 rounded-lg hover:bg-graphite-800"
          title="Clear stored demo images"
        >
          <RotateCcw size={15} />
        </button>
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
