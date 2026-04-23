import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserX, RotateCcw, Activity, Gift, CreditCard, Trophy, Users, CheckCircle } from 'lucide-react'
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
    { text: `Registered account`, time: user.joined, icon: Users },
    { text: 'Participated in iPhone 15 Pro Max lottery', time: '2026-04-10', icon: Gift },
    { text: 'Uploaded payment proof', time: '2026-04-10', icon: CreditCard },
    { text: 'Payment approved by admin', time: '2026-04-11', icon: CheckCircle },
    { text: 'Participated in Samsung TV lottery', time: '2026-03-20', icon: Gift },
  ]

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/users')}>
        <ArrowLeft size={14} /> All Users
      </button>

      {/* Profile Header */}
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Background Accent */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: 'linear-gradient(225deg, var(--primary-subtle) 0%, transparent 70%)', zIndex: 0 }} />
        
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            style={{ width: 100, height: 100, borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '4px solid var(--bg-page)', boxShadow: 'var(--shadow-card)' }} 
          />
          
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{user.name}</h1>
              <span className={`badge ${suspended || user.status === 'suspended' ? 'badge-rejected' : 'badge-active'}`} style={{ padding: '6px 12px', fontSize: 11 }}>
                {suspended || user.status === 'suspended' ? 'Suspended' : 'Active Account'}
              </span>
              {user.wins > 0 && <span style={{ padding: '4px 10px', background: 'var(--gold-bg)', color: 'var(--gold)', borderRadius: '20px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>🏆 Verified Winner</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <CreditCard size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.phone}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Activity size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.email || 'user@giftbox.cd'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <RotateCcw size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City / Location</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.city}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Activity size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.joined}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className={`btn ${suspended || user.status === 'suspended' ? 'btn-success' : 'btn-danger'}`}
              onClick={() => setSuspended(s => !s)}
              style={{ minWidth: 140 }}
            >
              <UserX size={15} />
              {suspended || user.status === 'suspended' ? 'Unsuspend' : 'Suspend User'}
            </button>
            <button className="btn btn-ghost">
              <RotateCcw size={15} /> Reset Auth
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 40 }}>
          {[
            { val: user.tickets, lbl: 'Tickets Purchased', icon: Gift, color: 'var(--accent-light)' },
            { val: user.wins, lbl: 'Lotteries Won', icon: Trophy, color: 'var(--gold)' },
            { val: (user.tickets * 2500).toLocaleString() + ' CDF', lbl: 'Total Investment', icon: CreditCard, color: 'var(--green)' },
          ].map(s => (
            <div key={s.lbl} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <s.icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>{s.val}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.lbl}</div>
              </div>
            </div>
          ))}
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
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
                <a.icon size={14} />
              </div>
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
