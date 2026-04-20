import { useState } from 'react'
import { Bell, CheckCircle, MessageCircle } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New support message', text: 'Anita Lukusa has sent a new message regarding "PlayStation 5" lottery.', time: '10 min ago', type: 'message', read: false },
    { id: '2', title: 'Payment verification pending', text: '5 participants have submitted payment proofs for iPhone 15 Pro Max Giveaway.', time: '1 hr ago', type: 'alert', read: false },
    { id: '3', title: 'Lottery automatically closed', text: 'The "PlayStation 5 Bundle" lottery has ended its schedule.', time: '3 hrs ago', type: 'system', read: true },
    { id: '4', title: 'Password changed', text: 'Your admin password was successfully updated via settings.', time: 'Yesterday', type: 'system', read: true },
  ])

  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, read: true })))
  }

  const markRead = (id) => {
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">System Notifications</div>
          <div className="section-sub">Stay updated on important system events and alerts</div>
        </div>
        <button className="btn btn-outline" onClick={markAllRead}>
          <CheckCircle size={14} /> Mark All as Read
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`message-row ${!n.read ? 'unread' : ''}`}
            onClick={() => markRead(n.id)}
            style={{ padding: '16px 20px', alignItems: 'flex-start' }}
          >
            <div className="msg-avatar" style={{ 
              background: n.type === 'message' ? 'rgba(59,130,246,.15)' : n.type === 'alert' ? 'rgba(245,158,11,.15)' : 'rgba(124,58,237,.15)',
              color: n.type === 'message' ? 'var(--blue)' : n.type === 'alert' ? 'var(--gold)' : 'var(--accent-light)' 
            }}>
              {n.type === 'message' ? <MessageCircle size={18} /> : n.type === 'alert' ? <div style={{ fontWeight: 800 }}>!</div> : <Bell size={18} />}
            </div>
            <div className="msg-info">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                {!n.read && <span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }} />}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{n.text}</div>
            </div>
            <div className="msg-meta" style={{ marginTop: 2 }}>
              <div className="msg-time">{n.time}</div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><Bell size={32} /></div>
            <div className="empty-title">All caught up!</div>
            <div className="empty-text">You have no new notifications to view.</div>
          </div>
        )}
      </div>
    </div>
  )
}
