"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MockLogin() {
  const router = useRouter();

  useEffect(() => {
    console.log("Setting mock user session...");
    localStorage.setItem("user_id", "mock-user-123");
    sessionStorage.setItem("user_id", "mock-user-123");
    
    // Redirect to the main coaching areas page
    setTimeout(() => {
      router.replace("/coaching_areas/");
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Mock Login Successful</h2>
          <p className="mt-2 text-sm text-gray-600">
            User session injected. Redirecting to Coaching Areas...
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-progress-fast"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
