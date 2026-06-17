import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, MessageSquare, Calendar, CheckSquare, BarChart3, Receipt, CreditCard, Gift, Lightbulb, HelpCircle, Menu, UserCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MantraLogoSVG } from "./MantraLogoSVG";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userString = localStorage.getItem("mantraUser");
  const user = userString ? JSON.parse(userString) : null;
  const userName = user?.name || "User";

  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainNavItems = [
    { icon: Home,          label: "Home",          path: "/dashboard"    },
    { icon: MessageSquare, label: "Care Team",      path: "/care-team"    },
    { icon: Calendar,      label: "Appointments",   path: "/appointments" },
    { icon: CheckSquare,   label: "Tasks",           path: "/tasks"        },
    { icon: BarChart3,     label: "Insights",        path: "/insights"     },
    { icon: Receipt,       label: "Billing",         path: "/billing"      },
    { icon: CreditCard,    label: "Plans (Only Testing)",           path: "/plans"        },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("mantraUser");
    navigate("/");
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="hidden md:flex bg-white border-r border-[#E2ECF5] flex-col h-screen overflow-y-auto overflow-x-hidden sticky top-0 flex-shrink-0"
    >
      {/* Logo + Hamburger */}
      <div className="p-3 border-b border-[#E2ECF5] flex items-center gap-2 min-h-[60px]">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setCollapsed((c) => !c)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#E6F4FF] hover:text-[#020817] transition-colors flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={18} />
        </motion.button>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center"
            >
              <MantraLogoSVG />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-0.5">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-[#E2ECF5] mx-2"></div>

        {/* Invite Friend */}
        <NavItem
          icon={Gift}
          label="Invite a Friend"
          collapsed={collapsed}
          active={isActive("/refer")}
          onClick={() => navigate("/refer")}
          colorClass={isActive("/refer") ? "bg-[#D1FAE5] text-[#059669] font-medium" : "text-[#059669] hover:bg-[#D1FAE5] hover:text-[#059669]"}
        />

        {/* Divider */}
        <div className="my-3 border-t border-[#E2ECF5] mx-2"></div>

        {/* Share Feedback & Support */}
        <div className="space-y-0.5">
          <NavItem
            icon={Lightbulb}
            label="Share Feedback (Wordpress)"
            collapsed={collapsed}
            active={isActive("/feedback")}
            onClick={() => navigate("/feedback")}
          />
          <NavItem
            icon={HelpCircle}
            label="Support"
            collapsed={collapsed}
            active={isActive("/support")}
            onClick={() => navigate("/support")}
          />
        </div>
      </nav>

      {/* Bottom Section - User Profile */}
      <div className="p-2 border-t border-[#E2ECF5]">
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full flex items-center rounded-xl transition-all py-2 ${collapsed ? "justify-center px-0" : "gap-3 px-3"} text-[#64748B] hover:bg-slate-100 hover:text-[#020817]`}
          >
            <div className="w-8 h-8 bg-[#2D9CDB] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {userName}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#1E293B] text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
              {userName}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E293B]"></div>
            </div>
          )}

          {/* Dropdown Content */}
          <AnimatePresence>
            {dropdownOpen && !collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-2 right-2 mb-2 bg-white border border-[#E2ECF5] rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#020817] transition-colors text-left"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <UserCircle size={18} />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <div className="border-t border-[#E2ECF5]"></div>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
  colorClass?: string;
}

function NavItem({ icon: Icon, label, collapsed, active, onClick, colorClass }: NavItemProps) {
  return (
    <div className="relative group">
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center rounded-xl transition-all py-2.5 ${
          collapsed ? "justify-center px-0" : "gap-3 px-3"
        } ${
          colorClass
            ? colorClass
            : active
            ? "bg-[#00c0ff] text-white"
            : "text-[#64748B] hover:bg-[#00c0ff] hover:text-white"
        }`}
      >
        <Icon size={20} className="flex-shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className={`text-sm whitespace-nowrap overflow-hidden ${active ? "font-semibold" : ""}`}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#1E293B] text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E293B]"></div>
        </div>
      )}
    </div>
  );
}
