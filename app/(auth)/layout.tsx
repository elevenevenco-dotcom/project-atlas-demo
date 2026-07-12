import Link from "next/link";
import { MapPin } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-graphite-950 text-mist-100 flex items-center justify-center px-6 atlas-grid">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-md bg-signal flex items-center justify-center">
            <MapPin size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Atlas
          </span>
        </Link>
        <div className="border border-graphite-700 bg-graphite-900 rounded-2xl p-7 shadow-panel">
          {children}
        </div>
      </div>
    </main>
  );
}
