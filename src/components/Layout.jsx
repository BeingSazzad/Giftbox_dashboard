import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Gift, Users, MessageSquare, FileText,
  Settings, LogOut, Bell, Search, Trophy, ChevronRight, Wallet
} from 'lucide-react'

const NAV = [
  {
    label: 'MAIN', items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Gift, label: 'Lotteries', path: '/lotteries', badge: '4' },
    ]
  },
  {
    label: 'PEOPLE', items: [
      { icon: Users, label: 'Users', path: '/users', badge: '248', badgeColor: '' },
      { icon: MessageSquare, label: 'Support', path: '/support', badge: '3', badgeColor: 'red' },
    ]
  },
  {
    label: 'CONTENT', items: [
      { icon: Wallet, label: 'Finance', path: '/finance' },
      { icon: FileText, label: 'CMS', path: '/cms' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ]
  },
]

export default function Layout({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ padding: '36px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: 'none' }}>
          <img src="/logo.png" alt="GiftBox Logo" style={{ width: 84, height: 'auto', marginBottom: 16, objectFit: 'contain' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="logo-text" style={{ fontSize: 28, fontWeight: 800 }}>Gift<span style={{ color: 'var(--gold)' }}>Box</span></div>
            <div className="logo-sub" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, letterSpacing: 0.5 }}>Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.label} style={{ marginBottom: 8 }}>
              {section.items.map(item => (
                <div
                  key={item.label}
                  className={`nav-item ${isActive(item.path) && !item.special ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="nav-icon" />
                  {item.label}
                  {item.badge && (
                    <span className={`nav-badge ${item.badgeColor || ''}`}>{item.badge}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div className="admin-info">
            <div className="admin-name">Admin</div>
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
          <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input placeholder="Search reports, users, or logs..." />
            </div>
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div className="admin-avatar" style={{ width: 38, height: 38, fontSize: 13 }}>AD</div>
          </div>
        </header>

        <main className="page-content page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


