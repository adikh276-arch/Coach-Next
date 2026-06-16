"use client";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import AuthGate from "@/components/AuthGate";
import "../_src/index.css";
import i18n from "../_src/i18n";
import { I18nextProvider } from "react-i18next";

const App = dynamic(() => import("../_src/App"), { ssr: false });

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <AuthGate>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </AuthGate>
    </Suspense>
  );
}
