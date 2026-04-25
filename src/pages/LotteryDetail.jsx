import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, Clock, CheckCircle, XCircle, RotateCcw,
  Trophy, Settings, Edit, Pause, X, Eye, Image, Tag, TrendingUp, AlertTriangle, FileText, Smartphone, HelpCircle
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
  const [viewProof, setViewProof] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const [lottery, setLottery] = useState(mockLotteries.find(l => l.id === id))
  const { d, h, m, s } = useCountdown(lottery?.endDate || '')

  const endLottery = () => {
    if (window.confirm('Are you sure you want to end this lottery immediately?')) {
      setLottery({ ...lottery, status: 'drawing' })
    }
  }

  if (!lottery) return (
    <div className="empty-state">
      <div className="empty-icon"><HelpCircle size={48} style={{ opacity: 0.2 }} /></div>
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge badge-${lottery.status}`}>{lottery.status}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID #{lottery.id}</span>
          </div>

          {/* Prize Image Thumbnail */}
          <div style={{ marginBottom: 20 }}>
            {lottery.prize?.image ? (
              <img src={lottery.prize.image} alt={lottery.title} style={{ width: 120, height: 120, borderRadius: 24, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-card)' }} />
            ) : (
              <div style={{ width: 120, height: 120, background: 'rgba(245,158,11,.15)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', border: '1px solid rgba(245,158,11,.25)' }}>
                <Trophy size={48} />
              </div>
            )}
          </div>

          {/* Text and Stats */}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px 0' }}>{lottery.title}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, maxWidth: 500, lineHeight: 1.5 }}>{lottery.description}</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Participants', value: lottery.participants, icon: Users },
                { label: 'Ticket Price', value: `${lottery.ticketPrice.toLocaleString()} CDF`, icon: Tag },
                { label: 'Revenue', value: `${lottery.revenue.toLocaleString()} CDF`, icon: TrendingUp },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <s.icon size={14} style={{ color: 'var(--text-muted)' }} />
                    {s.label}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Countdown + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end', minWidth: 260 }}>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {lottery.status !== 'completed' && (
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/lotteries/create')}>
                <Edit size={13} /> Edit
              </button>
            )}
            {lottery.status === 'active' && (
              <button className="btn btn-outline btn-sm">
                <Pause size={13} /> Pause
              </button>
            )}
          </div>

          {/* Countdown Box */}
          {lottery.status === 'active' && (
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 14, border: '1px solid var(--border)', width: '100%', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, fontWeight: 700, letterSpacing: 1.5 }}>CLOSES IN</div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="countdown">
                  {[['d', d], ['h', h], ['m', m], ['s', s]].map(([lbl, val], i) => (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="countdown-seg">
                        <div className="countdown-num">{String(val).padStart(2, '0')}</div>
                        <div className="countdown-label">{lbl}</div>
                      </div>
                      {i < 3 && <div className="countdown-sep">:</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Primary Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            {lottery.status === 'active' && (
              <button className="btn btn-danger" style={{ justifyContent: 'center', width: '100%', height: 44, borderRadius: 12 }} onClick={endLottery}>
                <XCircle size={16} /> End Lottery Now
              </button>
            )}
            {(lottery.status === 'drawing' || lottery.status === 'closed') && (
              <button 
                className="btn btn-gold" 
                style={{ 
                  justifyContent: 'center', 
                  width: '100%', 
                  height: 48, 
                  fontSize: 15, 
                  fontWeight: 700, 
                  borderRadius: 14,
                  boxShadow: '0 4px 15px rgba(217,119,6,0.3)',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                }} 
                onClick={() => navigate(`/lotteries/${id}/winner`)}
              >
                <Trophy size={18} /> Draw Winner(s)
              </button>
            )}
          </div>

          {/* Winners Section */}
          {lottery.status === 'completed' && lottery.winners && lottery.winners.length > 0 && (
            <div style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 16, padding: '16px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                <Trophy size={14} /> {lottery.winners.length} {lottery.winners.length > 1 ? 'Winners' : 'Winner'} Drawn
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lottery.winners.map((w, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={w.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--gold)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.city}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-sm" 
                style={{ 
                  marginTop: 20,
                  width: '100%', 
                  height: 40, 
                  fontSize: 12, 
                  fontWeight: 700,
                  background: 'rgba(245,158,11,.1)', 
                  color: 'var(--gold)', 
                  border: '1px solid rgba(245,158,11,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  borderRadius: 12,
                  transition: 'var(--transition)'
                }}
                onClick={() => navigate(`/lotteries/${id}/winner`)}
              >
                <RotateCcw size={14} /> Re-Draw / Change Winners
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs & Content */}
      {lottery.status !== 'scheduled' && lottery.status !== 'draft' && (
        <>
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={13} /> {statCounts.approved} approved</span>
          <span style={{ color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {statCounts.pending} pending</span>
          <span style={{ color: 'var(--red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={13} /> {statCounts.rejected} rejected</span>
        </div>
      </div>

      {/* Tab: Participants */}
      {tab === 'participants' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>City</th>
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
                  <td>{lottery.ticketPrice.toLocaleString()} CDF</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Payment Proofs */}
      {tab === 'proofs' && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Sender</th>
                <th style={{ width: '20%' }}>Amount</th>
                <th style={{ width: '15%' }}>Proof</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.filter(p => p.proof || p.status === 'pending').map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt="" style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 800 }}>{lottery.ticketPrice.toLocaleString()} CDF</td>
                  <td>
                    <div 
                      onClick={() => setViewProof(p)} 
                      style={{ 
                        width: 44, height: 32, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)', position: 'relative', background: 'var(--bg-elevated)'
                      }}
                    >
                      <img src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=200" alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div 
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', opacity: 0, transition: 'var(--transition)' }} 
                        onMouseOver={e => e.currentTarget.style.opacity = 1} 
                        onMouseOut={e => e.currentTarget.style.opacity = 0}
                      >
                        <Eye size={12} />
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      {p.status === 'pending' ? (
                        <>
                          <button 
                            className="btn" 
                            style={{ padding: '6px 12px', fontSize: 13, height: 'auto', background: 'rgba(16,185,129,.1)', color: 'var(--green)', border: '1px solid rgba(16,185,129,.2)' }} 
                            onClick={() => approveP(p.id)}
                            title="Approve"
                          >
                            <CheckCircle size={14} style={{ marginRight: 4 }} /> Approve
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '6px 12px', fontSize: 13, height: 'auto', background: 'rgba(239,68,68,.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)' }} 
                            onClick={() => setRejectModal(p.id)}
                            title="Reject"
                          >
                            <X size={14} style={{ marginRight: 4 }} /> Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reviewed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {participants.filter(p => p.proof || p.status === 'pending').length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><FileText size={48} style={{ opacity: 0.2 }} /></div>
              <div className="empty-title">No pending proofs</div>
              <div className="empty-text">All payment proofs have been reviewed.</div>
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* View Proof Modal */}
      {viewProof && (
        <div className="modal-overlay" onClick={() => setViewProof(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Payment Proof — {viewProof.name}</span>
              <button className="modal-close" onClick={() => setViewProof(null)}><X size={14} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800"
                alt="Payment Proof"
                style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
              />
              <div style={{ marginTop: 20, padding: 18, background: 'var(--bg-elevated)', borderRadius: 12, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Date Uploaded</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Apr 23, 14:22</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Amount Expected</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{lottery.ticketPrice.toLocaleString()} CDF</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setViewProof(null)}>Close</button>
              {viewProof.status === 'pending' && (
                <button className="btn btn-primary" onClick={() => { approveP(viewProof.id); setViewProof(null); }}>Approve Now</button>
              )}
            </div>
          </div>
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
              <div className="form-group mb-4">
                <label className="form-label">Reason for Rejection</label>
                <textarea className="form-textarea" placeholder="e.g. Blurry image, incorrect amount, wrong reference..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              </div>
              <label className="remember-check" style={{ padding: '12px 16px', background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, color: 'var(--red)', fontWeight: 600, alignItems: 'flex-start', display: 'flex', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: 2, accentColor: 'var(--red)' }} />
                <span>
                  <div style={{ marginBottom: 4, color: 'var(--red)' }}>Fraudulent Proof — Suspend Account</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>Per T&C, false or fraudulent proof results in permanent account suspension.</div>
                </span>
              </label>
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
