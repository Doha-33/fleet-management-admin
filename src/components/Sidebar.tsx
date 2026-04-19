import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Cpu,
  Settings,
  FileText,
  Inbox,
  Bell,
  User,
  LogOut,
  Truck,
  History,
  Package,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Factory,
  MessageCircle,
  HelpCircle,
  Server,
  ShieldCheck,
  Building2,
  Tag,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const isRTL = i18n.language === "ar";

  const menuItems = [
    { icon: LayoutDashboard, label: t("dashboard"), path: "/" },
    { icon: Package, label: t("products"), path: "/products" },
    { icon: Truck, label: t("vehicles"), path: "/vehicles" },
    { icon: FileText, label: t("blog"), path: "/blog" },
    { icon: Building2, label: t("clients"), path: "/clients" },
    { icon: Award, label: t("certificates_licenses"), path: "/certificates" },
    { icon: ShieldCheck, label: t("partnerships"), path: "/partnerships" },
    { icon: Tag, label: t("offers"), path: "/offers" },
    { icon: HelpCircle, label: t("faq_manager"), path: "/faq" },
    { icon: Settings, label: t("settings"), path: "/settings" },
    { icon: User, label: t("profile"), path: "/profile" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:inset-auto",
          // Width logic
          isCollapsed ? "lg:w-20" : "w-64",
          // Mobile positioning
          isRTL ? "right-0 border-s" : "left-0 border-e",
          // Mobile visibility
          isOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full"
              : "-translate-x-full",
          // Desktop visibility
          "lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "p-4 md:p-2 flex items-center justify-between",
            isCollapsed && "lg:px-4 lg:flex-col lg:gap-4",
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? t("expand") : t("collapse")}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                <Truck size={24} />
              </div>
            </button>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="font-bold text-lg leading-tight truncate">
                  FleetTrack
                </h1>
                <p className="text-xs text-slate-500 truncate">{t('admin_panel')}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                  isCollapsed && "lg:justify-center lg:px-0",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                size={20}
                className={cn(
                  "transition-transform duration-200 group-hover:scale-110 shrink-0",
                )}
              />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium",
              isCollapsed && "lg:justify-center lg:px-0",
            )}
            title={isCollapsed ? t("logout") : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">{t("logout")}</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
