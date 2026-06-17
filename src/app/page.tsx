"use client";

import { useEffect } from "react";
import { LoadingScreen, MANTRA_API } from "@/components/AuthGate";

/**
 * Root landing page — /coach/
 *
 * This handles Step 4-6 of the auth handshake:
 * platform.mantracare.com redirects back here with:
 *   platform.mantracare.com/coach/?token=XYZ&return_path=/coaching_areas
 *
 * Actions:
 * 1. If token found → validate → store user_id → navigate to return_path
 * 2. If valid session → go straight to /coaching_areas
 * 3. If neither → save path, go to /coach/token bridge
 */
export default function RootPage() {
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const token      = params.get("token");
      const returnPath = params.get("return_path"); // e.g. /coaching_areas/career



      // 1. Check if user is already authenticated (sessionStorage ONLY)
      const storedUserId = sessionStorage.getItem("user_id");
      
      if (storedUserId) {
        // If we are already at a specific deep link, don't redirect to the hub
        const isRoot = window.location.pathname === "/coach/" || 
                       window.location.pathname === "/coach" || 
                       window.location.pathname === "/";
                       
        if (!isRoot) {
          return;
        }
        window.location.replace("/coach/coaching_areas/");
        return;
      }

      // 2. Handle Returning from auth portal with a token
      if (token) {
        try {
          const res = await fetch(MANTRA_API, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ token }),
          });

          if (res.ok) {
            const data = await res.json();
            const uid  = data?.user_id;

            if (uid) {
              // SUCCESS: Store in sessionStorage ONLY
              sessionStorage.setItem("user_id", String(uid));

              // DATABASE PERSISTENCE (neon): Initial User Initialization
              try {
                const { syncUser } = await import("@/app/actions/userActions");
                await syncUser(uid);
              } catch (dbErr) {
                console.error("[RootPage] DB initialization failed:", dbErr);
              }

              // Strip token from URL bar
              window.history.replaceState({}, document.title, window.location.pathname);

              // Restore destination — Ensuring no double /coach/ prefix
              const dest =
                returnPath ||
                localStorage.getItem("APP_REDIRECT_PATH") ||
                "/coaching_areas/";
              localStorage.removeItem("APP_REDIRECT_PATH");

              let finalPath = dest.startsWith("/") ? dest : `/${dest}`;
              
              if (finalPath.startsWith("/coach/")) {
                finalPath = finalPath.replace("/coach", "");
              }

              if (finalPath === "/coaching_areas") {
                window.location.replace("/coach/coaching_areas/");
              } else {
                try {
                  if (finalPath !== "/coach/token" && finalPath !== "/coach/token/") {
                    localStorage.setItem("APP_REDIRECT_PATH", finalPath);
                  }
                  window.history.replaceState({}, document.title, window.location.pathname);
                  setTimeout(() => {
                    if (finalPath.startsWith("/coach/")) {
                      window.location.replace(finalPath);
                    } else {
                      window.location.replace("/coach" + finalPath);
                    }
                  }, 50);
                } catch (e) {
                  window.location.href = "/coach/token/";
                }
              }
              return;
            }
          }
        } catch (err) {
          console.error("[RootPage] Handshake validation failed:", err);
        }

        // Failure: execute a hard redirect to the bridge
        window.location.href = "/coach/token/";
        return;
      }

      // 3. No token, no session — send to portal directly
      const currentPath = window.location.pathname.replace("/coach", "");
      const intendedPath = currentPath && currentPath !== "/" ? currentPath : "/coaching_areas/";
      
      localStorage.setItem("APP_REDIRECT_PATH", intendedPath);
      window.location.href = "/coach/token/";
    };

    run();
  }, []);

  return <LoadingScreen />;
}
