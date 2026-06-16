"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import AuthGate from "@/components/AuthGate";
import "../_src/styles/index.css";
import "../_src/lib/i18n";

const App = dynamic(() => import("../_src/app/App"), { ssr: false });

export default function ClientPage() {
  return (
    <Suspense fallback={null}>
      <AuthGate>
        <App />
      </AuthGate>
    </Suspense>
  );
}
