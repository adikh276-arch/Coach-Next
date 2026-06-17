"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Crosshair, FileText, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { path: "/coach/coach_journey", icon: Home, label: t("nav.home"), exact: true },
    { path: "/coach/coach_journey/assessments", icon: FileText, label: t("nav.assessments") },
    { path: "/coach/coach_journey/goals", icon: Target, label: t("nav.goals") },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return pathname === path || pathname === path + "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 ml-14 sm:ml-16">
              <Link href="/coach/coach_journey" replace className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-900">{t("brand.coach")}</span>
                    <span className="text-sm text-gray-500">{t("brand.journey")}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center justify-center -mb-px">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path + item.label}
                  href={item.path}
                  replace
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                    active
                      ? "border-purple-600 text-purple-700 font-bold bg-purple-50/30"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? "text-purple-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto">
        <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
