"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { handleExit } from "@/lib/navigation";

export default function GlobalBackButton() {
  return (
    <div className="fixed top-4 left-4 z-[60] flex items-center gap-2">
      <button
        onClick={() => handleExit()}
        className="flex items-center justify-center p-2 rounded-xl bg-white shadow-lg hover:bg-slate-50 transition-all border border-slate-200 group"
        aria-label="Exit to MantraCare"
        title="Exit"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
