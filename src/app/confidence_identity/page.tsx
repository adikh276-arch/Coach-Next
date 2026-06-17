"use client";
import AuthGate from "@/components/AuthGate";
import Index from "./_src/pages/Index";

export default function Page() {
  return (
    <AuthGate>
      <Index />
    </AuthGate>
  );
}
