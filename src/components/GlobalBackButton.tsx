"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function GlobalBackButton() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-4 z-[60] flex items-center gap-2">
      <button
        onClick={() => {
          if (window.parent !== window) {
            window.parent.postMessage({ action: 'exit' }, 'https://web.mantracare.com');
          } else {
            window.location.href = 'https://web.mantracare.com';
          }
        }}
        className="flex items-center justify-center p-2 rounded-xl bg-white shadow-lg hover:bg-slate-50 transition-all border border-slate-200 group"
        aria-label="Exit to MantraCare"
        title="Exit"
      >
        <ArrowLeft className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
      </button>
    </div>
  );
}
