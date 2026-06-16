import './index.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mesh animate-fade-in text-center">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse"></div>
      </div>
    </div>
    <h2 className="text-xl font-semibold text-foreground tracking-tight animate-pulse">
      Preparing...
    </h2>
    <p className="mt-2 text-sm text-muted-foreground/60 max-w-xs px-6">
      Setting up your personalized confidence experience.
    </p>
  </div>
);

const AppContent = () => {
  const { userId, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!userId) {
    // Should have redirected, but safety first
    return null;
  }

  return (
    <BrowserRouter basename="/coach/confidence_identity">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TranslationProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TranslationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


