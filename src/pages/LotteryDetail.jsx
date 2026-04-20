import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, Clock, CheckCircle, XCircle, RotateCcw,
  Trophy, Settings, Edit, Pause, X, Eye, Image
} from 'lucide-react'
import { mockLotteries, mockParticipants } from '../data/mockData'

function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [targetDate])
  return t
}

export default function LotteryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('participants')
  const [participants, setParticipants] = useState(mockParticipants.filter(p => p.lotteryId === id))
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const lottery = mockLotteries.find(l => l.id === id)
  const { d, h, m, s } = useCountdown(lottery?.endDate || '')

  if (!lottery) return (
    <div className="empty-state">
      <div className="empty-icon">❓</div>
      <div className="empty-title">Lottery not found</div>
      <button className="btn btn-primary" style={{ margin: '14px auto 0', display: 'flex' }} onClick={() => navigate('/lotteries')}>
        <ArrowLeft size={14} /> Back
      </button>
    </div>
  )

  const approveP = (pid) => setParticipants(ps => ps.map(p => p.id === pid ? { ...p, status: 'approved' } : p))
  const rejectP = (pid) => { setParticipants(ps => ps.map(p => p.id === pid ? { ...p, status: 'rejected' } : p)); setRejectModal(null) }

  const statCounts = {
    all: participants.length,
    approved: participants.filter(p => p.status === 'approved').length,
    pending: participants.filter(p => p.status === 'pending').length,
    rejected: participants.filter(p => p.status === 'rejected').length,
  }

  return (
    <div>
      {/* Back */}
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate('/lotteries')}>
        <ArrowLeft size={14} /> All Lotteries
      </button>

      {/* Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-elevated), rgba(124,58,237,.12))',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: 24,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 24,
        alignItems: 'start',
      }}>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`badge badge-${lottery.status}`}>{lottery.status}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID #{lottery.id}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{lottery.title}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 500 }}>{lottery.description}</p>

          {/* Prize row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: 'rgba(245,158,11,.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, border: '1px solid rgba(245,158,11,.25)' }}>🏆</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5, fontWeight: 600 }}>Prize</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{lottery.prize.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lottery.prize.description}</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Participants', value: lottery.participants, icon: '👥' },
              { label: 'Pending', value: lottery.pendingApprovals, icon: '⏳', alert: lottery.pendingApprovals > 0 },
              { label: 'Ticket Price', value: `${lottery.ticketPrice.toLocaleString()} CDF`, icon: '💰' },
              { label: 'Revenue', value: `${lottery.revenue.toLocaleString()} CDF`, icon: '📈' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 3 }}>{s.icon} {s.label}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: s.alert ? 'var(--gold)' : 'var(--text-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Countdown + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end', minWidth: 200 }}>
          {lottery.status === 'active' && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginBottom: 8, fontWeight: 600 }}>CLOSES IN</div>
              <div className="countdown">
                {[['d', d], ['h', h], ['m', m], ['s', s]].map(([lbl, val], i) => (
                  <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="countdown-seg">
                      <div className="countdown-num">{String(val).padStart(2,'0')}</div>
                      <div className="countdown-label">{lbl}</div>
                    </span>
                    {i < 3 && <span className="countdown-sep">:</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {lottery.status === 'active' && (
              <>
                <button className="btn btn-outline btn-sm" style={{ justifyContent: 'center', width: '100%' }} onClick={() => navigate('/lotteries/create')}>
                  <Edit size={13} /> Edit
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'center', width: '100%' }}>
                  <Pause size={13} /> Pause
                </button>
                <button className="btn btn-danger btn-sm" style={{ justifyContent: 'center', width: '100%' }}>
                  <X size={13} /> Close Lottery
                </button>
                <button className="btn btn-gold btn-sm" style={{ justifyContent: 'center', width: '100%' }} onClick={() => navigate(`/lotteries/${id}/winner`)}>
                  <Trophy size={13} /> Draw Winner
                </button>
              </>
            )}
            {lottery.status === 'completed' && lottery.winner && (
              <div style={{ background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>🏆</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>WINNER</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold)' }}>{lottery.winner.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lottery.winner.city}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-5">
        <div className="tabs">
          {['participants', 'proofs'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'proofs' && statCounts.pending > 0 && (
                <span style={{ marginLeft: 6, background: 'var(--gold)', color: '#1a1000', borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 700 }}>{statCounts.pending}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ {statCounts.approved} approved</span>
          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>⏳ {statCounts.pending} pending</span>
          <span style={{ color: 'var(--red)', fontWeight: 600 }}>✕ {statCounts.rejected} rejected</span>
        </div>
      </div>

      {/* Tab: Participants */}
      {tab === 'participants' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>City</th>
                <th>Tickets</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id}>
                  <td className="td-primary">{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.city}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>×{p.tickets}</td>
                  <td>{(p.tickets * lottery.ticketPrice).toLocaleString()} CDF</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Payment Proofs */}
      {tab === 'proofs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {participants.filter(p => p.proof || p.status === 'pending').map(p => (
            <div key={p.id} className="proof-card">
              <div className="proof-img" style={{ fontSize: 28, background: 'rgba(124,58,237,.1)' }}>📱</div>
              <div className="proof-info">
                <div className="proof-name">{p.name}</div>
                <div className="proof-meta">
                  {p.phone} · {p.city} · {p.tickets} ticket(s) · {(p.tickets * lottery.ticketPrice).toLocaleString()} CDF
                </div>
                <div className="proof-actions">
                  {p.status === 'pending' ? (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => approveP(p.id)}>
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setRejectModal(p.id)}>
                        <XCircle size={12} /> Reject
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <RotateCcw size={12} /> Re-upload
                      </button>
                    </>
                  ) : (
                    <span className={`badge badge-${p.status}`}>{p.status}</span>
                  )}
                  <button className="btn btn-outline btn-sm"><Eye size={12} /> View Proof</button>
                </div>
              </div>
            </div>
          ))}
          {participants.filter(p => p.proof || p.status === 'pending').length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">No pending proofs</div>
              <div className="empty-text">All payment proofs have been reviewed.</div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Reject Payment</span>
              <button className="modal-close" onClick={() => setRejectModal(null)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Reason for Rejection</label>
                <textarea className="form-textarea" placeholder="e.g. Blurry image, incorrect amount, wrong reference..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => rejectP(rejectModal)}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
