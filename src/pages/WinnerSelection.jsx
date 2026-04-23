import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shuffle, Lock, Send, CheckCircle, Trophy, Megaphone, Target, Search } from 'lucide-react'
import { mockLotteries, mockParticipants } from '../data/mockData'

const STAGES = ['close', 'filter', 'select', 'confirm', 'manage']
const STAGE_LABELS = ['Close Lottery', 'Filter Pool', 'Select Winner', 'Confirm Result', 'Manage Winner']

export default function WinnerSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lottery = mockLotteries.find(l => l.id === id)
  const approved = mockParticipants.filter(p => p.lotteryId === id && p.status === 'approved')

  const [stage, setStage] = useState(0)
  const [winner, setWinner] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [locked, setLocked] = useState(false)
  const [published, setPublished] = useState(false)

  const rollWinner = () => {
    setRolling(true)
    setWinner(null)
    let count = 0
    const interval = setInterval(() => {
      const rand = approved[Math.floor(Math.random() * approved.length)]
      setWinner(rand)
      count++
      if (count >= 18) {
        clearInterval(interval)
        setRolling(false)
        setWinner(approved[Math.floor(Math.random() * approved.length)])
      }
    }, 80)
  }

  const confirmWinner = () => { setLocked(true); setStage(4) }
  const publishResult = () => { setPublished(true) }

  // Published state is now handled within stage 4

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate(`/lotteries/${id}`)}>
        <ArrowLeft size={14} /> Back to Lottery
      </button>

      <div className="section-header mb-6">
        <div>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy size={24} style={{ color: 'var(--gold)' }} /> Winner Selection
          </div>
          <div className="section-sub">{lottery?.title}</div>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper mb-8">
        {STAGE_LABELS.map((s, i) => (
          <>
            <div key={s} className={`step ${i === stage ? 'active' : i < stage ? 'done' : ''}`}>
              <div className="step-num">{i < stage ? <CheckCircle size={12} /> : i + 1}</div>
              <span style={{ fontSize: 11, display: window.innerWidth > 500 ? 'block' : 'none' }}>{s}</span>
            </div>
            {i < STAGE_LABELS.length - 1 && <div className={`step-line ${i < stage ? 'done' : ''}`} />}
          </>
        ))}
      </div>

      {/* Stage 0: Close */}
      {stage === 0 && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ color: 'var(--red)', opacity: 0.8, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Lock size={48} /></div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Close the Lottery</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 24px' }}>
            Closing this lottery will lock all new participant entries. Current status: <strong style={{ color: 'var(--green)' }}>Active</strong>
          </p>
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, fontSize: 13, color: 'var(--red)' }}>
            ⚠ This action cannot be undone. No new tickets will be accepted after closing.
          </div>
          <button className="btn btn-danger btn-lg" style={{ margin: '0 auto' }} onClick={() => setStage(1)}>
            <Lock size={16} /> Close & Lock Lottery
          </button>
        </div>
      )}

      {/* Stage 1: Filter */}
      {stage === 1 && (
        <div className="card" style={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ color: 'var(--accent-light)', opacity: 0.8, marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Search size={48} /></div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Filter Eligible Participants</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Only <strong style={{ color: 'var(--green)' }}>approved</strong> participants enter the winner pool</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>* System auto-verifies: Age 18+ and residing in valid cities (Kinshasa, Matadi, Boma, etc.)</p>
          </div>

          <div className="table-wrap" style={{ marginBottom: 24 }}>
            <table>
              <thead>
                <tr><th>Participant</th><th>City</th><th>Tickets</th><th>Status</th></tr>
              </thead>
              <tbody>
                {approved.map(p => (
                  <tr key={p.id}>
                    <td className="td-primary">{p.name}</td>
                    <td>{p.city}</td>
                    <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>×{p.tickets}</td>
                    <td><span className="badge badge-approved">approved</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 13 }}>
            ✅ <strong style={{ color: 'var(--green)' }}>{approved.length} approved participants</strong> will enter the random draw
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setStage(2)}>Proceed to Selection →</button>
          </div>
        </div>
      )}

      {/* Stage 2: Select */}
      {stage === 2 && (
        <div className="winner-stage">
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Random Winner Selection</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Drawing from {approved.length} approved participants</p>
          </div>

          <div style={{
            minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,.08)', border: '2px dashed var(--border-bright)',
            borderRadius: 'var(--radius-xl)', marginBottom: 28, padding: 24,
            transition: 'all .1s',
            position: 'relative'
          }}>
            {winner ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--gold)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Target size={40} /></div>
                <div style={{ fontSize: 24, fontWeight: 800, color: rolling ? 'var(--text-muted)' : 'var(--gold)', fontFamily: "'Space Grotesk',sans-serif", transition: 'color .2s' }}>
                   {winner.name}
                </div>
                {!rolling && <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{winner.phone} · {winner.city}</div>}
                {!rolling && locked && <div className="badge badge-primary" style={{ position: 'absolute', top: 12, right: 12 }}>Manual Selection</div>}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center' }}>
                <p>Press the button for a random draw</p>
                <p style={{ marginTop: 8, fontSize: 12 }}>OR</p>
                <p style={{ marginTop: 8 }}>Select a participant from the list below</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <button className="btn btn-primary btn-lg" onClick={rollWinner} disabled={rolling} style={{ minWidth: 180 }}>
              <Shuffle size={16} /> {rolling ? 'Drawing...' : 'Random Draw'}
            </button>
            {winner && !rolling && (
              <button className="btn btn-gold btn-lg" onClick={() => setStage(3)}>
                Continue with This Winner →
              </button>
            )}
          </div>

          {!rolling && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Manual Participant Selection</div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {approved.map(p => (
                  <div 
                    key={p.id} 
                    className="flex items-center justify-between p-3 mb-2 rounded-lg border border-transparent hover:border-primary cursor-pointer transition-all"
                    style={{ background: winner?.id === p.id ? 'var(--primary-subtle)' : 'var(--bg-elevated)', border: winner?.id === p.id ? '1px solid var(--primary)' : '1px solid transparent' }}
                    onClick={() => { setWinner(p); setLocked(true); }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.phone} · {p.city}</div>
                      </div>
                    </div>
                    {winner?.id === p.id && <CheckCircle size={16} style={{ color: 'var(--primary)' }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage 3: Confirm */}
      {stage === 3 && winner && (
        <div className="winner-stage">
          <div className="winner-trophy"><Trophy size={64} /></div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Selected Winner</div>
          <div className="winner-name">{winner.name}</div>
          <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 8 }}>{winner.phone}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>{winner.city} · {winner.tickets} ticket(s)</div>

          <div style={{ background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, fontSize: 13, color: 'var(--red)' }}>
            🔒 Confirming will <strong>permanently lock</strong> this result. This cannot be changed.
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost btn-lg" onClick={() => setStage(2)}>← Re-draw</button>
            <button className="btn btn-gold btn-lg" onClick={confirmWinner}>
              <Lock size={15} /> Lock & Confirm Winner
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Publish & Manage */}
      {stage === 4 && winner && (
        <div className="winner-stage">
          <div style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Megaphone size={64} /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Winner Management</h3>
          <div className="badge badge-active mb-4" style={{ padding: '6px 12px' }}>Draw Finalized</div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Official Winner:</p>
          <div className="winner-name" style={{ marginBottom: 6 }}>{winner.name}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>{winner.city} · {winner.phone}</div>

          {!published ? (
             <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border)' }}>
               <div style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, fontSize: 13, textAlign: 'left', fontWeight: 500 }}>
                 ✅ Publishing will push the announcement to the user app and notify all participants.
               </div>
               <button className="btn btn-primary btn-lg" style={{ margin: '0 auto' }} onClick={publishResult}>
                 <Send size={16} /> Publish Winner Announcement
               </button>
             </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: 16 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Post-Draw Protocol</h4>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ marginLeft: 'auto', color: 'var(--red)', background: 'rgba(239,68,68,.05)' }}
                  onClick={() => {
                    if (window.confirm("Prize not claimed? You can re-draw or change the winner within 5 days. Proceed?")) {
                      setStage(2);
                      setLocked(false);
                      setWinner(null);
                    }
                  }}
                >
                  <RotateCcw size={12} /> Redraw / Change Winner
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                 <label className="remember-check" style={{ fontSize: 14, color: 'var(--text-primary)', display: 'flex', gap: 10, cursor: 'pointer', margin: 0 }}>
                   <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} /> 
                   <span>Winner Contacted via WhatsApp/Phone</span>
                 </label>
                 <label className="remember-check" style={{ fontSize: 14, color: 'var(--text-primary)', display: 'flex', gap: 10, cursor: 'pointer', margin: 0 }}>
                   <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} /> 
                   <span>Winner Responded (Max 3 days)</span>
                 </label>
                 <label className="remember-check" style={{ fontSize: 14, color: 'var(--text-primary)', display: 'flex', gap: 10, cursor: 'pointer', margin: 0 }}>
                   <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} /> 
                   <span>Reward Delivered (Max 5 days)</span>
                 </label>
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--red)', fontWeight: 500 }}>
                 *If winner fails to respond within 5 days, they must be disqualified and the draw repeated.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
