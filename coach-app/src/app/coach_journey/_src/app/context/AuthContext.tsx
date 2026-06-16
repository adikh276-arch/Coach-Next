"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { sql } from '../../lib/db';

interface AuthContextType {
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({ userId: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // Handshake is handled by AuthGate (Next.js layer)
      // which sets sessionStorage "user_id".
      const storedUserId = sessionStorage.getItem('user_id');
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (!storedUserId && !urlToken) {
        window.location.href = "/coach/";
        return;
      }

      // Flow 1: Active session validates seamlessly
      if (storedUserId) {
        setUserId(storedUserId);
        
        // Clean URL if token is stubbornly present
        if (urlToken) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        setIsValidating(false);
        return;
      }

      // Flow 2: Handshake payload found -> validate with external Auth provider
      if (urlToken) {
        try {
          const response = await fetch('https://api.mantracare.com/user/user-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: urlToken }),
          });

          if (!response.ok) {
            throw new Error('Invalid token handshake response');
          }

          const data = await response.json();
          // Typically returns { data: { _id: "..." } } or { user_id: "..." }
          const validatedUserId = data?.data?._id || data?.user_id || data?.id;

          if (!validatedUserId) {
            throw new Error('API resolved but missing user identity payload');
          }

          // 1. Structural DB persistence (Upsert User to satisfy foreign key dependencies)
          try {
            await sql`
              INSERT INTO users (id) 
              VALUES (${validatedUserId}) 
              ON CONFLICT (id) DO NOTHING
            `;
          } catch (dbErr) {
            console.error('Initial user record creation skipped (may already exist or schema unaligned):', dbErr);
          }

          // 2. Persist local isolated session tracking
          sessionStorage.setItem('user_id', String(validatedUserId));
          setUserId(String(validatedUserId));

          // 3. Clean up the URL to prevent sharing token leakage
          window.history.replaceState({}, document.title, window.location.pathname);
          
          setIsValidating(false);
        } catch (error) {
          console.error('Handshake validation critically failed:', error);
          setErrorStatus('Establishing your journey connection...');
          // Hard redirect to token gateway on explicit handshake rejection
          window.location.href = "/coach/token/";
        }
        return;
      }

      // Flow 3: No session, no token -> Kill render, execute hard unauthorized bounce
      window.location.href = "/coach/token/";
    };

    initAuth();
  }, []);

  // Blocking render: Full screen loader prevents sub-queries from executing with null User_IDs
  if (isValidating || !userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Preparing your journey...</h2>
        <p className="text-gray-500 text-sm">Harmonizing your personal dashboard</p>
        
        {errorStatus && (
          <div className="mt-8 p-4 bg-purple-50 text-purple-600 rounded-lg text-sm max-w-md text-center">
            {errorStatus}
          </div>
        )}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider layer');
  }
  return context;
}



