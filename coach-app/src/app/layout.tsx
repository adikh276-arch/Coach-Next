import type { Metadata } from "next";
import "./globals.css";
import React, { Suspense } from "react";
import AuthGate from "@/components/AuthGate";
import GlobalBackButton from "@/components/GlobalBackButton";

export const metadata: Metadata = {
  title: "MantraCoach",
  description: "Your personal coaching hub for growth, habits, focus, and emotional wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:," />
        <script src="/coach/env-config.js" defer></script>
      </head>
      <body>
        <Suspense fallback={null}>
          <AuthGate>
            <GlobalBackButton />
            {children}
          </AuthGate>
        </Suspense>
      </body>
    </html>
  );
}
