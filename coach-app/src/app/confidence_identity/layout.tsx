"use client";

import './_src/index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationProvider } from "./_src/contexts/TranslationContext";
import { AuthProvider } from "./_src/contexts/AuthContext";
import { useState } from "react";

export default function ConfidenceIdentityLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TranslationProvider>
            <Toaster />
            <Sonner />
            {children}
          </TranslationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
