"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * AuthGuard / AuthGate — Secure auth handshake for all /coach/* mini-apps.
 *
 * Requirements implemented:
 * 1. Intercept Unauthenticated Deep Links
 * 2. Handle Auth Portal Return & Magic Links
 * 3. Smart Restore & Navigate
 * 4. Stale Token Cleanup
 */

const MANTRA_API = "https://api.mantracare.com/user/user-info";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background gap-5">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30 opacity-30" />
        <div className="relative h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">Preparing your experience</p>
        <p className="text-sm text-muted-foreground mt-1 animate-pulse">Just a moment…</p>
      </div>
    </div>
  );
}

export { LoadingScreen, MANTRA_API };

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // We only run this on the client
    if (typeof window === "undefined") return;

    const token = searchParams.get("token");
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const fullPath = currentPath + currentSearch;
    
    // Determine the "activity slug" based on the path
    // e.g. /coach/goal_momentum -> goal_momentum
    // or just the full path if we can't parse it cleanly.
    const activitySlug = currentPath.split('/').filter(p => p && p !== 'app' && p !== 'coach')[0] || "";

    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      
      // 0. MOCK USER BYPASS (Localhost Testing Only)
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        console.log("[AuthGuard] Mock user detected for local testing.");
        const mockUserId = "12345";
        sessionStorage.setItem("user_id", mockUserId);
        
        // Ensure mock user exists in DB to satisfy Foreign Key constraints
        try {
          const { syncUser } = await import("@/app/actions/userActions");
          await syncUser(mockUserId);
        } catch (dbErr) {
          console.error("[AuthGuard] Mock DB initialization failed:", dbErr);
        }

        setReady(true);
        return;
      }

      // 1. Check if user is already authenticated (sessionStorage ONLY)
      const userId = sessionStorage.getItem("user_id");
      
      if (userId) {
        // Stale Token Cleanup (Failsafe)
        if (token) {
          console.log("[AuthGuard] Stale token detected with active session. Cleaning URL.");
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.toString());
        }
        setReady(true);
        return;
      }

      // 2. Handle Handshake Protocol (Validation)
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
              // RESOLUTION: Store in sessionStorage ONLY
              sessionStorage.setItem("user_id", String(newUserId));

              // DATABASE PERSISTENCE (neon): Initial User Initialization
              try {
                const { syncUser } = await import("@/app/actions/userActions");
                await syncUser(newUserId);
              } catch (dbErr) {
                console.error("[AuthGuard] DB initialization failed:", dbErr);
                // Non-fatal, allow UI to render
              }

              // RESOLUTION: Clean URL
              const url = new URL(window.location.href);
              url.searchParams.delete("token");
              window.history.replaceState({}, "", url.toString());

              // Restore destination or stay on current
              const savedPath = localStorage.getItem("APP_REDIRECT_PATH");
              if (savedPath) {
                localStorage.removeItem("APP_REDIRECT_PATH");
                router.replace(savedPath);
              }
              
              setReady(true);
              return;
            }
          }
        } catch (error) {
          console.error("[AuthGuard] Handshake validation failed:", error);
        }
        
        // Failure: execute a hard redirect to the bridge
        window.location.href = "/coach/token/";
        return;
      }

      // 3. Missing Token/Session: Execute hard redirect
      // Intercept deep link for restoration later
      if (currentPath.includes("/token")) {
        setReady(true);
        return;
      }

      localStorage.setItem("APP_REDIRECT_PATH", fullPath);
      window.location.href = "/coach/token/";
    };

    handleAuth();
  }, [pathname, searchParams, router]);

  if (!ready) return <LoadingScreen />;

  return <>{children}</>;
}

