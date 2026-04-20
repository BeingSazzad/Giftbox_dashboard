import { useState, useEffect } from 'react'
import { Eye, EyeOff, Gift, Shield, ArrowRight, Lock } from 'lucide-react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setParticles(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 6 + 4,
    })))
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 1200)
  }

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb one" />
      <div className="login-bg-orb two" />

      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: 'rgba(124,58,237,0.6)',
          opacity: p.opacity,
          pointerEvents: 'none',
          animation: `pulse ${p.duration}s ease-in-out infinite`,
        }} />
      ))}

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="GiftBox Logo" className="login-logo-icon" />
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20 }}>
              Gift<span style={{ color: 'var(--gold)' }}>Box</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>ADMIN PORTAL</div>
          </div>
        </div>

            <h1 className="login-heading">Welcome back 👋</h1>
            <p className="login-sub">Sign in to manage your lottery system</p>

            {error && (
              <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--red)', marginBottom: 14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email / Phone</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="admin@giftbox.cd"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', color: 'var(--text-muted)', display: 'flex',
                  }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <label className="remember-check">
                  <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
                  Remember me
                </label>
                <span className="forget-link">Forgot password?</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}
                style={{ justifyContent: 'center', opacity: loading ? .7 : 1 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                    Signing in...
                  </span>
                ) : (
                  <><ArrowRight size={16} /> Sign In</>
                )}
              </button>
            </form>

            <div style={{ marginTop: 20, padding: '14px', borderRadius: 10, background: 'rgba(124,58,237,.08)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              <Shield size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--accent-light)' }} />
              This portal is restricted to authorized administrators only
            </div>
      </div>
    </div>
  )
}
