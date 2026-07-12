"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, LocalUser } from "@/lib/local-auth";
import { Loader2 } from "lucide-react";

// Replaces the old Next.js middleware + Supabase session check. Since this
// build has no server, route protection happens client-side by reading the
// local demo session and redirecting if it's missing.
export default function AuthGuard({
  children,
}: {
  children: (user: LocalUser) => React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null | "loading">("loading");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
  }, [router]);

  if (user === "loading" || user === null) {
    return (
      <div className="min-h-screen bg-graphite-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-signal-soft" size={24} />
      </div>
    );
  }

  return <>{children(user)}</>;
}
