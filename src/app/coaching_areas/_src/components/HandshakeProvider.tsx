import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MANTRA_API } from "@/components/AuthGate";
import { syncUser } from "@/app/actions/userActions";

export function HandshakeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      // 0. MOCK USER BYPASS (Localhost Testing Only)
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        sessionStorage.setItem("user_id", "12345");
        await syncUser("12345").catch(console.error);
        setReady(true);
        return;
      }

      const token = searchParams.get("token");
      const userId = sessionStorage.getItem("user_id");

      if (userId) {
        if (token) {
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.toString());
        }
        setReady(true);
        return;
      }

      if (token) {
        try {
          const response = await fetch(MANTRA_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            const newUserId = data?.user_id;

            if (newUserId) {
              sessionStorage.setItem("user_id", String(newUserId));
              await syncUser(String(newUserId)).catch(console.error);

              const url = new URL(window.location.href);
              url.searchParams.delete("token");
              window.history.replaceState({}, "", url.toString());
              
              setReady(true);
              return;
            }
          }
        } catch (error) {
          console.error("Handshake validation failed:", error);
        }
      }

      window.location.href = "/coach/token/";
    };

    handleAuth();
  }, [pathname, searchParams]);

  if (!ready) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-background gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <div className="h-6 w-6 rounded-full bg-primary" />
        </div>
        <p className="text-sm font-bold text-foreground animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>;
}
