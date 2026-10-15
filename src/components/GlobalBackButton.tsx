"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { handleExit } from "@/lib/navigation";

export default function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    // Normalise path (remove trailing slash and /coach prefix for comparison)
    const clean = (pathname || "").replace(/^\/coach/, "").replace(/\/+$/, "");

    // 1. Root hub or base entry points -> exit
    if (!clean || clean === "/coaching_areas" || clean === "/token" || clean === "/mock-login") {
      handleExit();
      return;
    }

    // 2. Inside coaching areas hierarchy:
    // e.g. /coaching_areas/career/improvement-canvas -> /coaching_areas/career
    // e.g. /coaching_areas/career/learn/0 -> /coaching_areas/career
    // e.g. /coaching_areas/career/resource/tips -> /coaching_areas/career
    // e.g. /coaching_areas/career -> /coaching_areas/
    if (clean.startsWith("/coaching_areas/")) {
      const parts = clean.split("/").filter(Boolean); // ["coaching_areas", "career", "improvement-canvas"]
      if (parts.length > 2) {
        // We are on an exercise, learn, or resource page -> return to the area page (e.g. /coaching_areas/career/)
        router.replace(`/coaching_areas/${parts[1]}/`);
        return;
      } else if (parts.length === 2) {
        // We are on an area page (e.g. /coaching_areas/career) -> return to hub (/coaching_areas/)
        router.replace("/coaching_areas/");
        return;
      }
    }

    // Fallback: if browser history exists, go back, else handleExit
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      handleExit();
    }
  };

  return (
    <div className="fixed top-4 left-4 z-[60] flex items-center gap-2">
      <button
        onClick={handleClick}
        className="flex items-center justify-center p-2 rounded-xl bg-white shadow-lg hover:bg-slate-50 transition-all border border-slate-200 group"
        aria-label="Back"
        title="Back"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
