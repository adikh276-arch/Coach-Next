import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./app/App.tsx";
import "./lib/i18n";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-purple-600 font-bold">Loading Context...</div>}>
    <App />
  </Suspense>
);
