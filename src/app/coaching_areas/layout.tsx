"use client";

import './_src/index.css';
import './_src/i18n';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HandshakeProvider } from "./_src/components/HandshakeProvider";
import { Suspense, useState } from "react";

export default function CoachingAreasLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Suspense fallback={
          <div className="flex flex-col h-screen w-screen items-center justify-center bg-background gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <div className="h-6 w-6 rounded-full bg-primary" />
            </div>
            <p className="text-sm font-bold text-foreground animate-pulse">Mantra Coach</p>
          </div>
        }>
          <Toaster />
          <Sonner />
          <HandshakeProvider>
            {children}
          </HandshakeProvider>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
