import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserX, RotateCcw, Activity, Gift, CreditCard, Trophy } from 'lucide-react'
import { mockUsers, mockParticipants, mockLotteries } from '../data/mockData'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('history')
  const [suspended, setSuspended] = useState(false)

  const user = mockUsers.find(u => u.id === id)
  if (!user) return (
    <div className="empty-state">
      <div className="empty-icon">❓</div>
      <div className="empty-title">User not found</div>
      <button className="btn btn-primary" style={{ margin: '14px auto 0', display: 'flex' }} onClick={() => navigate('/users')}>
        <ArrowLeft size={14} /> Back
      </button>
    </div>
  )

  const userParticipations = mockParticipants.filter(p =>
    mockParticipants.find(mp => mp.name === user.name)?.lotteryId === p.lotteryId && p.name === user.name
  )

  const activityLog = [
    { text: `Registered account`, time: user.joined, icon: '👤' },
    { text: 'Participated in iPhone 15 Pro Max lottery', time: '2026-04-10', icon: '🎁' },
    { text: 'Uploaded payment proof', time: '2026-04-10', icon: '📱' },
    { text: 'Payment approved by admin', time: '2026-04-11', icon: '✅' },
    { text: 'Participated in Samsung TV lottery', time: '2026-03-20', icon: '🎁' },
  ]

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/users')}>
        <ArrowLeft size={14} /> All Users
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(${Number(user.id)*47},70%,45%), hsl(${Number(user.id)*90},60%,35%))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, flexShrink: 0,
          border: '3px solid var(--accent-light)',
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="profile-name">{user.name}</div>
            <span className={`badge ${suspended || user.status === 'suspended' ? 'badge-rejected' : 'badge-active'}`}>
              {suspended || user.status === 'suspended' ? 'suspended' : 'active'}
            </span>
            {user.wins > 0 && <span style={{ fontSize: 13 }}>🏆 Winner</span>}
          </div>
          <div className="profile-phone">{user.phone} · {user.city}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Joined {user.joined}</div>
          <div className="profile-stats">
            {[
              { val: user.tickets, lbl: 'Tickets Bought' },
              { val: user.wins, lbl: 'Lotteries Won' },
              { val: (user.tickets * 2500).toLocaleString(), lbl: 'Total Spent (CDF)' },
            ].map(s => (
              <div key={s.lbl} className="profile-stat">
                <div className="profile-stat-val">{s.val}</div>
                <div className="profile-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className={`btn btn-sm ${suspended || user.status === 'suspended' ? 'btn-success' : 'btn-danger'}`}
            onClick={() => setSuspended(s => !s)}
          >
            <UserX size={13} />
            {suspended || user.status === 'suspended' ? 'Unsuspend' : 'Suspend User'}
          </button>
          <button className="btn btn-ghost btn-sm">
            <RotateCcw size={13} /> Reset Password
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-5">
        {[
          { key: 'history', label: 'Participation History', icon: Gift },
          { key: 'payments', label: 'Payment History', icon: CreditCard },
          { key: 'wins', label: 'Win History', icon: Trophy },
          { key: 'activity', label: 'Activity Log', icon: Activity },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Participation History */}
      {tab === 'history' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Lottery</th><th>Tickets</th><th>Amount Paid</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {mockLotteries.slice(0, 3).map(l => (
                <tr key={l.id}>
                  <td className="td-primary">{l.title}</td>
                  <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>×{Math.ceil(Math.random() * 3 + 1)}</td>
                  <td>{(2500 * 2).toLocaleString()} CDF</td>
                  <td><span className="badge badge-approved">approved</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment History */}
      {tab === 'payments' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Transaction Ref</th><th>Lottery</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {[
                { ref: 'TXN-20260410-001', lottery: 'iPhone 15 Pro Max', amount: 5000, method: 'M-Pesa', status: 'approved', date: '2026-04-10' },
                { ref: 'TXN-20260320-014', lottery: 'Samsung TV', amount: 2500, method: 'Airtel Money', status: 'approved', date: '2026-03-20' },
                { ref: 'TXN-20260215-007', lottery: 'PS5 Bundle', amount: 7500, method: 'M-Pesa', status: 'rejected', date: '2026-02-15' },
              ].map(t => (
                <tr key={t.ref}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-light)' }}>{t.ref}</td>
                  <td className="td-primary">{t.lottery}</td>
                  <td style={{ fontWeight: 700 }}>{t.amount.toLocaleString()} CDF</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.method}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Win History */}
      {tab === 'wins' && (
        <div>
          {user.wins > 0 ? (
            <div style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,.15) 0%, transparent 65%)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 'var(--radius-xl)', padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>Won PlayStation 5 Bundle</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Lottery closed: 2026-03-31 · Announced: 2026-04-02</div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <div className="empty-title">No wins yet</div>
              <div className="empty-text">This user hasn't won any lotteries yet.</div>
            </div>
          )}
        </div>
      )}

      {/* Activity Log */}
      {tab === 'activity' && (
        <div className="card" style={{ padding: '6px 20px' }}>
          {activityLog.map((a, i) => (
            <div key={i} className="activity-item">
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <div className="activity-detail">
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
