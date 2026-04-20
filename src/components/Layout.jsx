import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Gift, Users, MessageSquare, FileText,
  Settings, LogOut, Bell, Search, Trophy, ChevronRight
} from 'lucide-react'

const NAV = [
  { label: 'MAIN', items: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Gift, label: 'Lotteries', path: '/lotteries', badge: '4' },
    { icon: Trophy, label: 'Winners', path: '/lotteries', special: 'winners' },
  ]},
  { label: 'PEOPLE', items: [
    { icon: Users, label: 'Users', path: '/users', badge: '248', badgeColor: '' },
    { icon: MessageSquare, label: 'Support', path: '/support', badge: '3', badgeColor: 'red' },
  ]},
  { label: 'CONTENT', items: [
    { icon: FileText, label: 'CMS', path: '/cms' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]},
]

export default function Layout({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="GiftBox Logo" className="logo-icon" />
          <div>
            <div className="logo-text">Gift<span>Box</span></div>
            <div className="logo-sub">Admin Panel</div>
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
          <div className="topbar-title">
            {getPageTitle(location.pathname)}
            <span>/ GiftBox Admin</span>
          </div>
          <div className="topbar-actions">
            <div className="search-box" style={{ width: 200 }}>
              <Search size={14} className="search-icon" />
              <input placeholder="Search..." />
            </div>
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={16} />
              <span className="notif-dot" />
            </button>
            <div className="admin-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>AD</div>
          </div>
        </header>

        <main className="page-content page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function getPageTitle(path) {
  if (path.includes('/dashboard')) return 'Dashboard'
  if (path.includes('/lotteries/create')) return 'Create Lottery'
  if (path.includes('/lotteries/') && path.includes('/winner')) return 'Winner Selection'
  if (path.includes('/lotteries/')) return 'Lottery Detail'
  if (path.includes('/lotteries')) return 'Lotteries'
  if (path.includes('/users/')) return 'User Profile'
  if (path.includes('/users')) return 'Users'
  if (path.includes('/support')) return 'Support'
  if (path.includes('/cms')) return 'CMS'
  if (path.includes('/settings')) return 'Settings'
  if (path.includes('/notifications')) return 'Notifications'
  return 'GiftBox'
}
