import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getOrCreateUser } from "@/lib/exerciseDb";

/**
 * HandshakeProvider — used inside coaching_areas SPA (react-router context).
 * Delegates the real auth check to sessionStorage set by AuthGate (the Next.js
 * layer). If session exists → proceeds. If not → hard redirect to login.
 *
 * Also handles DB user initialization after a successful handshake.
 */
export const HandshakeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      // AuthGate (the Next.js wrapper) has already validated the token and
      // stored user_id in sessionStorage before this SPA is rendered.
      const userId = sessionStorage.getItem("user_id");

      if (userId) {
        try {
          await getOrCreateUser(userId);
        } catch (e) {
          console.error("[HandshakeProvider] DB init failed:", e);
          // Non-fatal — still allow UI to render
        }
        setIsReady(true);
        return;
      }

      // If somehow no user_id (AuthGate should have caught this),
      // redirect to /coach/ so the parent app can recover.
      window.location.replace("/coach/");
    };

    initialize();
    // Only run once on mount — location.search changes should NOT re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-background gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <div className="h-6 w-6 rounded-full bg-primary" />
        </div>
        <p className="text-sm font-bold text-foreground animate-pulse">
          Preparing your personal space...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
