"use client";
import AuthGate from "@/components/AuthGate";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./_src/App"), { ssr: false });

export default function Page() {
  return (
    <AuthGate>
      <App />
    </AuthGate>
  );
}
