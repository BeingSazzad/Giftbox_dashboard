import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shuffle, Lock, Send, CheckCircle, Trophy, Megaphone, Target, Search, RotateCcw, X, XCircle } from 'lucide-react'
import { mockLotteries, mockParticipants } from '../data/mockData'

const STAGES = ['close', 'select', 'confirm', 'manage']
const STAGE_LABELS = ['Close Lottery', 'Select Winner', 'Confirm Result', 'Manage Winner']

export default function WinnerSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lottery = mockLotteries.find(l => l.id === id)
  const [stage, setStage] = useState((lottery?.status === 'drawing' || lottery?.status === 'completed') ? 1 : 0) // Stage 1 is now 'select'
  const [targetWinnerCount, setTargetWinnerCount] = useState(1)
  const [winners, setWinners] = useState([])
  const [rolling, setRolling] = useState(false)
  const [currentRollingWinner, setCurrentRollingWinner] = useState(null)
  const [locked, setLocked] = useState(false)
  const [published, setPublished] = useState(false)
  const [search, setSearch] = useState('')

  const participants = mockParticipants.filter(p => p.lotteryId === id)
  const approved = participants.filter(p => p.status === 'approved')
  const filteredPool = approved.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const rollWinner = () => {
    if (winners.length >= targetWinnerCount) return
    setRolling(true)
    
    // Pick from those NOT already winners
    const finalPool = approved.filter(p => !winners.find(w => w.id === p.id))
    if (finalPool.length === 0) {
      alert("No more unique participants to pick from!")
      setRolling(false)
      return
    }

    let count = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * finalPool.length)
      setCurrentRollingWinner(finalPool[randomIndex])
      count++
      if (count > 20) {
        clearInterval(interval)
        const finalWinner = finalPool[Math.floor(Math.random() * finalPool.length)]
        setWinners(prev => [...prev, finalWinner])
        setCurrentRollingWinner(finalWinner)
        setRolling(false)
      }
    }, 50)
  }

  const batchDraw = () => {
    const remainingCount = targetWinnerCount - winners.length
    const pool = approved.filter(p => !winners.find(w => w.id === p.id))
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const newWinners = shuffled.slice(0, remainingCount)
    setWinners([...winners, ...newWinners])
  }

  const confirmWinner = () => {
    setLocked(true)
    setStage(3) // Move to Stage 3 (Manage/Publish)
  }

  const publishResult = () => {
    setPublished(true)
    // Stay in Stage 3 but show the protocol/management UI
  }

  const handleBack = () => {
    if (stage > 0) {
      setStage(stage - 1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 800, padding: '40px 20px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <button className="btn btn-ghost btn-icon" onClick={handleBack} title={stage > 0 ? "Previous Step" : "Back to Lottery"}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{lottery.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span className={`badge badge-${lottery.status}`}>{lottery.status}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: #{lottery.id}</span>
          </div>
        </div>
      </div>

      {/* Steps Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 48, position: 'relative', padding: '0 10px' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: 15, left: '5%', right: '5%', height: 3, background: 'var(--border-dark)', zIndex: 0, borderRadius: 2 }} />
        {/* Progress Line */}
        <div style={{ 
          position: 'absolute', top: 15, left: '5%', 
          width: `${(stage / (STAGE_LABELS.length - 1)) * 90}%`, 
          height: 3, background: 'var(--primary)', zIndex: 0, borderRadius: 2,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />

        {STAGE_LABELS.map((label, idx) => (
          <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 32, height: 32, borderRadius: '50%', 
              background: idx < stage ? 'var(--green)' : idx === stage ? 'var(--primary)' : 'var(--bg-card)',
              color: idx <= stage ? 'white' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: idx === stage ? 800 : 600,
              border: idx <= stage ? 'none' : '2px solid var(--border-dark)',
              boxShadow: idx === stage ? '0 0 0 4px var(--primary-subtle)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {idx < stage ? <CheckCircle size={18} /> : idx + 1}
            </div>
            <span style={{ fontSize: 11, fontWeight: idx === stage ? 700 : 500, color: idx <= stage ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Stage 0: Close */}
      {stage === 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ color: 'var(--red)', marginBottom: 20, display: 'flex', justifyContent: 'center' }}><Lock size={64} /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Ready to finalize?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
            Closing the lottery will stop all new entries and prepare the pool for winner selection.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => setStage(1)}>Proceed to Selection →</button>
          </div>
        </div>
      )}

      {/* Stage 1: Select */}
      {stage === 1 && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Pick Winners</h3>
            <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>
              🎯 Drawing from {approved.length} approved participants
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Winners:</span>
              <input 
                type="number" 
                min="1" 
                value={targetWinnerCount} 
                onChange={(e) => setTargetWinnerCount(parseInt(e.target.value) || 1)}
                style={{ width: 60, padding: '6px 10px', borderRadius: 10, border: '1px solid var(--border)', textAlign: 'center', fontWeight: 800, background: 'var(--bg-elevated)', color: 'var(--primary)' }}
              />
            </div>
          </div>

          {/* Main Draw Action */}
          <div style={{ 
            background: 'var(--bg-elevated)', 
            borderRadius: 16, 
            padding: 24, 
            textAlign: 'center',
            marginBottom: 24,
            border: '1px solid var(--border)'
          }}>
            {rolling ? (
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>
                {currentRollingWinner?.name || 'Rolling...'}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={rollWinner} disabled={rolling || winners.length >= targetWinnerCount} style={{ height: 44, padding: '0 24px' }}>
                  <Shuffle size={16} /> Draw Random
                </button>
                {winners.length < targetWinnerCount && (
                  <button className="btn btn-ghost" onClick={batchDraw} disabled={rolling} style={{ border: '1px solid var(--border)', height: 44 }}>
                    Quick Fill ({targetWinnerCount - winners.length})
                  </button>
                )}
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              Progress: {winners.length} / {targetWinnerCount}
            </div>
          </div>

          {/* Current Winners Summary */}
          {winners.length > 0 && (
            <div style={{ marginBottom: 24, padding: 16, background: 'rgba(245,158,11,.03)', border: '1px dashed var(--gold)', borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Selected Winners ({winners.length})</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {winners.map((w, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--gold)', borderRadius: 20, padding: '4px 12px 4px 6px', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeInScale 0.3s ease' }}>
                    <img src={w.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{w.name}</span>
                    <X size={12} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setWinners(winners.filter(win => win.id !== w.id))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unified Participant List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Participants Pool</div>
            <div className="search-box" style={{ width: 180, height: 32, padding: '0 12px', gap: 8 }}>
              <Search size={14} className="search-icon" style={{ opacity: 0.6 }} />
              <input 
                placeholder="Search name..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: 12, padding: 0, textAlign: 'left', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ maxHeight: 280, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingRight: 6 }}>
            {filteredPool.length === 0 ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: 13 }}>
                No participants match "{search}"
              </div>
            ) : filteredPool.map(p => {
              const isWinner = winners.find(w => w.id === p.id)
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    if (isWinner) {
                      setWinners(winners.filter(w => w.id !== p.id))
                    } else if (winners.length < targetWinnerCount) {
                      setWinners([...winners, p])
                    } else {
                      alert(`Target reached! You can only select ${targetWinnerCount} winners.`)
                    }
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: '10px 14px', 
                    borderRadius: 12, 
                    border: isWinner ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: isWinner ? 'var(--primary-subtle)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <img src={p.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.city}</div>
                  </div>
                  {isWinner ? (
                    <Trophy size={14} style={{ color: 'var(--gold)' }} />
                  ) : (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--border)' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Action */}
          {winners.length > 0 && !rolling && (
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-gold btn-lg" style={{ width: '100%', maxWidth: 300 }} onClick={() => setStage(2)}>
                Review {winners.length} Winner(s) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stage 2: Confirm */}
      {stage === 2 && winners.length > 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ color: 'var(--gold)', marginBottom: 20, display: 'flex', justifyContent: 'center' }}><Trophy size={64} /></div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Final Result Confirmation</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>{winners.length} Winners Selected</h3>
          
          <div style={{ width: '100%', marginBottom: 32 }}>
            {winners.map((w, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                 <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>{idx + 1}</div>
                 <img src={w.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                 <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 700 }}>{w.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {w.phone}{w.email ? ` · ${w.email}` : ''} · {w.city}
                            </div>
                 </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, fontSize: 13, color: 'var(--red)' }}>
            🔒 Confirming will <strong>permanently lock</strong> these {winners.length} winners.
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost btn-lg" onClick={() => setStage(1)}>← Re-draw</button>
            <button className="btn btn-gold btn-lg" onClick={confirmWinner}>
              <Lock size={15} /> Lock & Confirm All Winners
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Publish & Manage */}
      {stage === 3 && winners.length > 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Megaphone size={64} /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Draw Finalized</h3>
          <div className="badge badge-active mb-6" style={{ padding: '6px 12px' }}>{winners.length} Winners Officially Selected</div>
          
          <div style={{ width: '100%', marginBottom: 24 }}>
             {winners.map((w, idx) => (
                <div key={idx} style={{ background: 'rgba(245,158,11,.05)', border: '1px solid rgba(245,158,11,.15)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                   <img src={w.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--gold)' }} />
                   <div style={{ flex: 1, textAlign: 'left' }}>
                       <div style={{ fontWeight: 800, color: 'var(--gold)' }}>{w.name}</div>
                       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                         {w.phone}{w.email ? ` · ${w.email}` : ''} · {w.city}
                       </div>
                   </div>
                </div>
             ))}
          </div>

          {!published ? (
             <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border)', width: '100%' }}>
               <div style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, fontSize: 13, textAlign: 'left', fontWeight: 500 }}>
                 ✅ Publishing will announce the result to the user app and notify all participants.
               </div>
               <button className="btn btn-primary btn-lg" style={{ margin: '0 auto', width: '100%' }} onClick={publishResult}>
                 <Send size={16} /> Publish Winners Announcement
               </button>
             </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600 }}>
                  🎉 Result Successfully Published
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ height: 44, padding: '0 32px', borderRadius: 12, fontWeight: 700, fontSize: 14 }}
                    onClick={() => navigate('/lotteries')}
                  >
                    Done & Return to Lotteries
                  </button>
                  <button 
                    className="btn btn-sm" 
                    style={{ 
                      height: 44,
                      padding: '0 24px',
                      color: 'var(--red)', 
                      background: 'rgba(239,68,68,.1)', 
                      border: '1.5px solid var(--red)',
                      fontWeight: 700,
                      fontSize: 14,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    onClick={() => {
                      if (window.confirm("Prizes not claimed? You can re-draw or change winners. Proceed?")) {
                        setStage(1);
                        setLocked(false);
                        setWinners([]);
                      }
                    }}
                  >
                    <RotateCcw size={16} /> Redraw
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
