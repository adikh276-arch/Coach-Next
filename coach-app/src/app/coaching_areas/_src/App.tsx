import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./i18n";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { HandshakeProvider } from "./components/HandshakeProvider";

const queryClient = new QueryClient();

const App = () => (
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
        <BrowserRouter basename="/coach/coaching_areas">
          <HandshakeProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/:areaId" element={<Index />} />
              <Route path="/:areaId/:exerciseSlug" element={<Index />} />
              <Route path="/:areaId/learn/:learnIndex" element={<Index />} />
              <Route path="/:areaId/resource/:resourceType" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HandshakeProvider>
        </BrowserRouter>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
