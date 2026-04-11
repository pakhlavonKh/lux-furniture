import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Newspaper,
  Percent,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";

export type AdminTab = "dashboard" | "products" | "inventory" | "news" | "discounts";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  userEmail: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: AdminTab; labelKey: string; icon: React.ReactNode }[] = [
  { id: "dashboard", labelKey: "admin.dashboard", icon: <LayoutDashboard /> },
  { id: "products", labelKey: "admin.products", icon: <Package /> },
  { id: "inventory", labelKey: "admin.inventory", icon: <Warehouse /> },
  { id: "news", labelKey: "admin.news", icon: <Newspaper /> },
  { id: "discounts", labelKey: "admin.discounts", icon: <Percent /> },
];

export function AdminLayout({
  activeTab,
  onTabChange,
  userEmail,
  onLogout,
  children,
}: AdminLayoutProps) {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initial = userEmail?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="admin-layout">
      {/* Mobile header */}
      <div className="admin-mobile-header">
        <button
          className="admin-mobile-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <span className="admin-mobile-title">Manaku</span>
        <div style={{ width: 38 }} />
      </div>

      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-logo">
          <h1>Manaku</h1>
          <span>{t("admin.loginForm")}</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                onTabChange(item.id);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              {t(item.labelKey)}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">{initial}</div>
            <span className="admin-sidebar-email">{userEmail}</span>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            <LogOut />
            {t("admin.logout")}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
