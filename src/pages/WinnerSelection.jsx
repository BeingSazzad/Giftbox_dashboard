import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shuffle, Lock, Send, CheckCircle, Trophy } from 'lucide-react'
import { mockLotteries, mockParticipants } from '../data/mockData'

const STAGES = ['close', 'filter', 'select', 'confirm', 'publish']
const STAGE_LABELS = ['Close Lottery', 'Filter Pool', 'Select Winner', 'Confirm Result', 'Publish']

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

  if (published) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>Winner Announced!</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 8 }}>{winner?.name} has been notified.</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>The result has been pushed to the user app.</p>
          <button className="btn btn-primary" onClick={() => navigate('/lotteries')}>
            <ArrowLeft size={14} /> Back to Lotteries
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm mb-4" onClick={() => navigate(`/lotteries/${id}`)}>
        <ArrowLeft size={14} /> Back to Lottery
      </button>

      <div className="section-header mb-6">
        <div>
          <div className="section-title">🏆 Winner Selection</div>
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
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
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Filter Eligible Participants</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Only <strong style={{ color: 'var(--green)' }}>approved</strong> participants enter the winner pool</p>
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

          {/* Rolling display */}
          <div style={{
            minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,.08)', border: '2px dashed var(--border-bright)',
            borderRadius: 'var(--radius-xl)', marginBottom: 28, padding: 24,
            transition: 'all .1s',
          }}>
            {winner ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: rolling ? 'var(--text-muted)' : 'var(--gold)', fontFamily: "'Space Grotesk',sans-serif", transition: 'color .2s' }}>
                  {winner.name}
                </div>
                {!rolling && <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{winner.phone} · {winner.city}</div>}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Press the button to draw a winner</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={rollWinner} disabled={rolling} style={{ minWidth: 180 }}>
              <Shuffle size={16} /> {rolling ? 'Drawing...' : 'Random Draw'}
            </button>
            {winner && !rolling && (
              <button className="btn btn-gold btn-lg" onClick={() => setStage(3)}>
                Continue with This Winner →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage 3: Confirm */}
      {stage === 3 && winner && (
        <div className="winner-stage">
          <div className="winner-trophy">🏆</div>
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

      {/* Stage 4: Publish */}
      {stage === 4 && winner && (
        <div className="winner-stage">
          <div style={{ fontSize: 64, marginBottom: 16 }}>📣</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Publish Result</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Winner is locked:</p>
          <div className="winner-name" style={{ marginBottom: 6 }}>{winner.name}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>{winner.city} · {winner.phone}</div>

          <div style={{ background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, fontSize: 13 }}>
            ✅ Publishing will push the announcement to the user app and notify all participants.
          </div>

          <button className="btn btn-gold btn-lg" style={{ margin: '0 auto' }} onClick={publishResult}>
            <Send size={16} /> Publish Winner Announcement
          </button>
        </div>
      )}
    </div>
  )
}
