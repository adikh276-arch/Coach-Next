"use client";

import './_src/styles/index.css';
import './_src/lib/i18n';
import { AssessmentProvider } from "./_src/app/context/AssessmentContext";
import { AuthProvider } from "./_src/app/context/AuthContext";
import { RootLayout } from "./_src/app/components/RootLayout";

export default function CoachJourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <RootLayout>
          {children}
        </RootLayout>
      </AssessmentProvider>
    </AuthProvider>
  );
}
