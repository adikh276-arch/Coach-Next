"use client";
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Target, Crosshair, FileText, Menu, X, Home, Globe, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Root() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home'), exact: true },
    { path: '/assessments', icon: FileText, label: t('nav.assessments') },
    { path: '/goals', icon: Target, label: t('nav.goals') },
    { path: '/', icon: Crosshair, label: t('nav.focusAreas'), exact: true, isSecondary: true },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 ml-14 sm:ml-16">
              <Link to="/" replace className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">{t('brand.coach')}</span>
                  <span className="text-sm text-gray-500">{t('brand.journey')}</span>
                </div>
              </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center justify-center -mb-px">
            {navItems.filter(item => !item.isSecondary).map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  replace
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-200 ${
                    active
                      ? 'border-purple-600 text-purple-700 font-bold bg-purple-50/30'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto">
        <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
