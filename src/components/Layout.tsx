import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Gift,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Bell,
  Wallet,
} from "lucide-react";
import { useGetUserQuery } from "../store/services/user.api";

const NAV = [
  {
    label: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Gift, label: "Lotteries", path: "/lotteries", badge: "4" },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      {
        icon: Users,
        label: "Users",
        path: "/users",
        badge: "248",
        badgeColor: "",
      },
      {
        icon: MessageSquare,
        label: "Support",
        path: "/support",
        badge: "3",
        badgeColor: "red",
      },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { icon: Wallet, label: "Finance", path: "/finance" },
      { icon: FileText, label: "CMS", path: "/cms" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const { data: user, isLoading } = useGetUserQuery({});
  const navigate = useNavigate();
  const location = useLocation();
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  const userData = user?.data || {};
  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div
          className="sidebar-logo"
          style={{
            padding: "36px 16px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "none",
          }}
        >
          <img
            src="/logo.png"
            alt="GiftBox Logo"
            style={{
              width: 84,
              height: "auto",
              marginBottom: 16,
              objectFit: "contain",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div
              className="logo-text"
              style={{ fontSize: 28, fontWeight: 800 }}
            >
              Gift<span style={{ color: "var(--gold)" }}>Box</span>
            </div>
            <div
              className="logo-sub"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginTop: 4,
                letterSpacing: 0.5,
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((section) => (
            <div key={section.label} style={{ marginBottom: 8 }}>
              {section.items.map((item: any) => (
                <div
                  key={item.label}
                  className={`nav-item ${isActive(item.path) && !item.special ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="nav-icon" />
                  {item.label}
                  {item.badge && (
                    <span className={`nav-badge ${item?.badgeColor! || ""}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <img
            className="admin-avatar"
            src={userData.avatar || "/avatar-placeholder.png"}
            alt="Admin Avatar"
          />
          <div className="admin-info">
            <div className="admin-name">{userData.name || "Admin"}</div>
            <div className="admin-role">Super Admin</div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-area">
        <header className="topbar">
          {/* Page title removed as per user feedback — redundant with sidebar */}
          <div className="topbar-actions" style={{ marginLeft: "auto" }}>
            <button
              className="icon-btn"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <img
              className="admin-avatar"
              style={{ width: 38, height: 38, fontSize: 13 }}
              src={userData?.profileImage || "/avatar-placeholder.png"}
              alt="Admin Avatar"
            />
          </div>
        </header>

        <main className="page-content page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
