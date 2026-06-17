import React, { createContext, useContext, useState, useEffect } from "react";
import { sql } from "../lib/db";

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(sessionStorage.getItem("user_id"));
  const [isLoading, setIsLoading] = useState(!userId);
  useEffect(() => {
    const validateToken = async () => {
      // Handshake is handled by AuthGate (Next.js layer)
      const sessionUserId = sessionStorage.getItem("user_id");
      
      if (!sessionUserId && !params.get("token")) {
        window.location.href = "/coach/";
        return;
      }

      if (sessionUserId) {
        setIsLoading(false);
        return;
      }

      if (userId) {
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        window.location.href = "/coach/token/";
        return;
      }

      try {
        const response = await fetch("https://api.mantracare.com/user/user-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Handshake failed");

        const data = await response.json();
        // user_id might be numeric or uuid, we store as string
        const id = data.user_id?.toString();
        if (!id) throw new Error("Invalid response");

        sessionStorage.setItem("user_id", id);
        setUserId(id);

        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, "", url.toString());

      } catch (error) {
        console.error("Auth Error:", error);
        window.location.href = "/coach/token/";
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};



