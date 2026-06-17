import { useEffect, useState } from 'react';
import { getUserId, setUserId, clearSession } from '@/lib/auth';
import { syncUser } from '@/app/actions/userActions';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    async function validateToken() {
      // 1. Extract URL Parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      // Handshake is handled by AuthGate (Next.js layer)
      // which sets sessionStorage "user_id".
      const sessionUserId = sessionStorage.getItem("user_id");
      
      if (!sessionUserId && !token) {
        window.location.href = "/coach/";
        return;
      }

      // If we already have a session, we can let them through instantly
      if (sessionUserId) {
        if (token) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('token');
          window.history.replaceState({}, '', newUrl.toString());
        }
        setIsReady(true);
        return;
      }

      // If missing session and missing token, completely fail auth.
      if (!token) {
        setIsFailed(true);
        return;
      }

      // 2. Validation Handshake with Mantracare API
      try {
        const response = await fetch('https://api.mantracare.com/user/user-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error('Validation API rejected the token');
        }

        const data = await response.json();
        
        // Handle various potential API payload structures
        let finalUserId = data.user_id || data.data?.user_id || data.id || data.userId;

        if (!finalUserId) {
            throw new Error('API returned 200 OK but payload was missing the ID');
        }
        
        // 3. Database Initialization
        // We ensure the BIGINT user exists in the `users` table for foreign keys
        try {
            await syncUser(finalUserId);
        } catch (dbErr) {
            console.error('Failed to initialize user in Neon schema:', dbErr);
            // This shouldn't crash the flow since they are authenticated.
        }

        // 4. Save Session
        setUserId(finalUserId.toString());

        // 5. Clean URL Bar
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('token');
        window.history.replaceState({}, '', newUrl.toString());

        // Yield UI Access
        setIsReady(true);

      } catch (err) {
        console.error('Authentication handshake failed:', err);
        clearSession();
        setIsFailed(true);
      }
    }

    validateToken();
  }, []);

  if (isFailed) {
    // Hard redirect on validation failure
    window.location.href = "/coach/token/";
    return null;
  }

  // Blocking full-screen loading state (prevents component flicker)
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[9999]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse text-sm">Preparing your experience...</p>
      </div>
    );
  }

  return <>{children}</>;
}



