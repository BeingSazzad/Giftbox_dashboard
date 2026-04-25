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

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  return (
    <div>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/users')}>
        <ArrowLeft size={14} /> All Users
      </button>

      {/* Profile Header */}
      <div className="card" style={{ padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
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
                  <Trophy size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age Verification</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: calculateAge(user.dob) < 18 ? 'var(--red)' : 'var(--text-primary)' }}>
                    {calculateAge(user.dob)} Years Old {calculateAge(user.dob) < 18 && ' (Underage)'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Users size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Birth</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.dob || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Activity size={14} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tiny)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City / Location</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{user.city}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              className={`btn ${suspended || user.status === 'suspended' ? 'btn-success' : 'btn-danger'}`}
              onClick={() => setSuspended(s => !s)}
              style={{ minWidth: 140 }}
            >
              <UserX size={15} />
              {suspended || user.status === 'suspended' ? 'Unsuspend' : 'Suspend User'}
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 40 }}>
          {[
            { val: userParticipations.length, lbl: 'Lotteries Joined', icon: Gift, color: 'var(--accent-light)' },
            { val: user.wins, lbl: 'Lotteries Won', icon: Trophy, color: 'var(--gold)' },
            { val: (userParticipations.length * 2500).toLocaleString() + ' CDF', lbl: 'Total Investment', icon: CreditCard, color: 'var(--green)' },
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
          { key: 'wins', label: 'Win History', icon: Trophy },
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
              <tr><th>Lottery</th><th>Amount Paid</th><th>Proof</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {mockLotteries.slice(0, 3).map(l => (
                <tr key={l.id}>
                  <td className="td-primary">{l.title}</td>
                  <td style={{ fontWeight: 600 }}>{2500.toLocaleString()} CDF</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={12} /> View Proof
                    </button>
                  </td>
                  <td><span className="badge badge-approved">approved</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.startDate}</td>
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
    </div>
  )
}
