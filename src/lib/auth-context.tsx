import React, { createContext, useContext, useEffect, useState } from "react";
import { sql } from "./db";

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("user_id"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performHandshake = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      // 1. Check for existing session first
      const existingSession = sessionStorage.getItem("user_id");
      if (existingSession && !token) {
        setUserId(existingSession);
        setIsLoading(false);
        return;
      }

      // 2. If no token and no session, redirect
      if (!token) {
        window.location.href = "/coach/token/";
        return;
      }

      try {
        // 3. Handshake API Validation
        const response = await fetch("https://api.mantracare.com/user/user-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Authentication failed");

        const data = await response.json();
        const authenticatedUserId = String(data.user_id);

        if (!authenticatedUserId) throw new Error("Invalid user ID");

        // 4. Persistence - Initialize User in Neon
        await sql`
          INSERT INTO users (id) 
          VALUES (${authenticatedUserId})
          ON CONFLICT (id) DO NOTHING
        `;

        // 5. Store session and clean URL
        sessionStorage.setItem("user_id", authenticatedUserId);
        setUserId(authenticatedUserId);
        
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Handshake Handlers:", error);
        window.location.href = "/coach/token";
      }
    };

    performHandshake();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="relative mb-8 text-primary">
          <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-primary rounded-lg opacity-20 animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Preparing...</h2>
        <p className="text-muted-foreground max-w-xs leading-relaxed text-sm">
          
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};



