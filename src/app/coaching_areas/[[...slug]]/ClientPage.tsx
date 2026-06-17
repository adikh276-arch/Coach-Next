"use client";
import React from "react";
import AuthGate from "@/components/AuthGate";
import Index from "../_src/pages/Index";

export default function ClientPage() {
  return (
    <AuthGate>
      <Index />
    </AuthGate>
  );
}
