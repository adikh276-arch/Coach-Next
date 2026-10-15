"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { handleExit } from "@/lib/navigation";

export default function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Normalise path (remove trailing slash and /coach prefix for comparison)
  const clean = (pathname || "").replace(/^\/coach/, "").replace(/\/+$/, "");

  // If we are deeper in coaching_areas (like /coaching_areas/career or /coaching_areas/career/improvement-canvas),
  // hide the floating GlobalBackButton because each subpage already has its own dedicated header back button!
  const isNestedCoachingArea = clean.startsWith("/coaching_areas/") && clean !== "/coaching_areas";
  if (isNestedCoachingArea) {
    return null;
  }

  const handleClick = () => {
    // At root or base entry points, clicking the global back button exits cleanly
    handleExit();
  };

  return (
    <div className="fixed top-4 left-4 z-[60] flex items-center gap-2">
      <button
        onClick={handleClick}
        className="flex items-center justify-center p-2 rounded-xl bg-white shadow-lg hover:bg-slate-50 transition-all border border-slate-200 group"
        aria-label="Exit"
        title="Exit"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
