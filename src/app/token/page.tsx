"use client";

import { useEffect } from "react";

/**
 * /coach/token — Internal Auth Bridge Page
 *
 * This page is the intermediary that launches the user toward the
 * MantraCare Identity Portal. It:
 * 1. Reads the saved activity path from localStorage
 * 2. Constructs the full return URL (back to this platform with return_path)
 * 3. Redirects to platform\.mantracare.com/app/coach?redirect_url=...
 *
 * After the portal authenticates, it sends the user BACK to:
 *   platform.mantracare.com/coach/?token=XYZ&return_path=/coaching_areas
 * which is handled by the root page.tsx
 */

const WEB_PORTAL    = "https://web.mantracare.com/app/coach/";
const PLATFORM_ROOT = "https://platform.mantracare.com/coach";

export default function TokenBridge() {
  useEffect(() => {
    // No mock bypass in production protocol

    // Retrieve the saved activity path (e.g. /coaching_areas/career)
    const returnPath = localStorage.getItem("APP_REDIRECT_PATH") || "/coaching_areas";

    const returnUrl = `${PLATFORM_ROOT}/?return_path=${encodeURIComponent(returnPath)}`;

    // Full login URL with redirect_url so the portal knows where to send the token
    const loginUrl = `${WEB_PORTAL}?redirect_url=${encodeURIComponent(returnUrl)}`;

    window.location.replace(loginUrl);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 gap-5">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-30" />
        <div className="relative h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-slate-800">Connecting securely</p>
        <p className="text-sm text-slate-500 mt-1 animate-pulse">Taking you to sign in…</p>
      </div>
    </div>
  );
}
