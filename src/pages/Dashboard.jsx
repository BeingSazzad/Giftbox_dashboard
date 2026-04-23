import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Gift, Users, Clock, CheckCircle, DollarSign, Plus,
  Eye, Search, TrendingUp, AlertCircle, Zap, BarChart2, ArrowRight, Trophy, Tag, CheckSquare, CreditCard, Wallet, Award
} from 'lucide-react'
import { mockLotteries, mockParticipants, mockUsers } from '../data/mockData'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'

const userGrowthData = [
  { name: 'Jan', users: 1200, tickets: 400 }, { name: 'Feb', users: 2100, tickets: 700 }, { name: 'Mar', users: 3400, tickets: 1300 },
  { name: 'Apr', users: 4800, tickets: 2100 }, { name: 'May', users: 5900, tickets: 2600 }, { name: 'Jun', users: 8200, tickets: 4100 },
  { name: 'Jul', users: 10400, tickets: 5500 }, { name: 'Aug', users: 13200, tickets: 7200 }, { name: 'Sep', users: 16100, tickets: 9300 },
  { name: 'Oct', users: 19800, tickets: 11500 }, { name: 'Nov', users: 24500, tickets: 15800 }, { name: 'Dec', users: 31000, tickets: 21200 }
]

const revenueData = [
  { name: 'Jan', revenue: 400 }, { name: 'Feb', revenue: 800 }, { name: 'Mar', revenue: 1200 },
  { name: 'Apr', revenue: 2100 }, { name: 'May', revenue: 2500 }, { name: 'Jun', revenue: 4200 },
  { name: 'Jul', revenue: 5800 }, { name: 'Aug', revenue: 7600 }, { name: 'Sep', revenue: 8900 },
  { name: 'Oct', revenue: 11000 }, { name: 'Nov', revenue: 14500 }, { name: 'Dec', revenue: 18400 }
]

function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { d, h, m, s }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t) }, [targetDate])
  return time
}

function CountdownWidget({ date }) {
  const { d, h, m, s } = useCountdown(date)
  return (
    <div className="countdown">
      {[['d', d], ['h', h], ['m', m], ['s', s]].map(([lbl, val], i) => (
        <>
          <div className="countdown-seg" key={lbl}>
            <div className="countdown-num">{String(val).padStart(2, '0')}</div>
            <div className="countdown-label">{lbl}</div>
          </div>
          {i < 3 && <span className="countdown-sep">:</span>}
        </>
      ))}
    </div>
  )
}

const QUICK_ACTIONS = [
  { label: 'New Lottery', icon: Plus, color: 'accent', path: '/lotteries/create' },
  { label: 'Verifications', icon: CheckCircle, color: 'gold', path: '/lotteries' },
  { label: 'Active Lotteries', icon: Gift, color: 'green', path: '/lotteries' },
  { label: 'User Search', icon: Search, color: 'blue', path: '/users' },
  { label: 'Support Inbox', icon: AlertCircle, color: 'red', path: '/support' },
  { label: 'Revenue Report', icon: BarChart2, color: 'pink', path: '/settings' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const completedDraws = mockLotteries.filter(l => l.status === 'completed').length;
  const pendingPayments = mockParticipants.filter(p => p.status === 'pending').length;
  const ticketsSold = mockParticipants.reduce((s, p) => s + p.tickets, 0);
  const totalRevenue = mockLotteries.reduce((s, l) => s + l.revenue, 0);

  const metrics = [
    { label: 'Total Users', value: mockUsers.length.toLocaleString(), icon: Users, color: 'blue', change: '12%', dir: 'up' },
    { label: 'Draws Completed', value: completedDraws.toLocaleString(), icon: CheckSquare, color: 'accent', change: '1', dir: 'up' },
    { label: 'Pending Payments', value: pendingPayments.toLocaleString(), icon: CreditCard, color: 'gold', change: pendingPayments > 0 ? 'Action needed' : 'All clear', dir: pendingPayments > 0 ? 'down' : 'up' },
    { label: 'Tickets Sold', value: ticketsSold.toLocaleString(), icon: Tag, color: 'green', change: '24%', dir: 'up' },
    { label: 'Total Revenue', value: `${(totalRevenue / 1000).toFixed(0)}K CDF`, icon: Wallet, color: 'pink', change: '18%', dir: 'up' },
  ]

  const nextLottery = mockLotteries.find(l => l.status === 'active')


  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 24 }}>👋</span>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Good afternoon, Admin</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            You have <strong style={{ color: 'var(--gold)' }}>3 pending payment verifications</strong> and the <strong style={{ color: 'var(--accent-light)' }}>Weekly Draw</strong> is running right now.
          </p>
        </div>
        {nextLottery && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>NEXT DEADLINE — {nextLottery.title}</div>
            <CountdownWidget date={nextLottery.endDate} />
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {metrics.map(m => (
          <div key={m.label} className={`metric-card ${m.color}`}>
            <div className="flex items-center justify-between">
              <div className={`metric-icon ${m.color}`}>
                <m.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`badge badge-${m.dir === 'up' ? 'active' : 'closed'}`} style={{ padding: '6px 10px', fontSize: '12px' }}>
                {m.dir === 'up' ? '↑' : '↓'} {m.change}
              </div>
            </div>
            <div>
              <div className="metric-label" style={{ fontSize: '14px', textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: 'var(--text-muted)', marginBottom: '8px' }}>
                {m.label}
              </div>
              <div className="metric-value" style={{ fontSize: '32px', fontFamily: 'Inter, sans-serif' }}>
                {m.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* User Growth vs Tickets Sold */}
        <div className="card" style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Users vs Tickets Sold</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Conversion overview</div>
            </div>
            <select className="form-select" style={{ width: 85, padding: '4px 10px', fontSize: 12, height: 28 }}>
              {['2026', '2025', '2024'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={val => val >= 1000 ? (val/1000)+'k' : val} />
                <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-card)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area type="monotone" name="Total Users" dataKey="users" stroke="var(--green)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" name="Tickets Sold" dataKey="tickets" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="card" style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Income (CDF)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Revenue trajectory</div>
            </div>
            <select className="form-select" style={{ width: 85, padding: '4px 10px', fontSize: 12, height: 28 }}>
              {['2026', '2025', '2024'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(val) => val >= 1000 ? (val/1000)+'M' : val} />
                <RechartsTooltip cursor={{ fill: 'var(--bg-hover)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-card)' }} />
                <Bar dataKey="revenue" fill="var(--gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Quick Actions</div>
            <div className="section-sub">Common admin operations</div>
          </div>
          <Zap size={16} style={{ color: 'var(--gold)' }} />
        </div>
        <div className="quick-grid">
          {QUICK_ACTIONS.map(a => (
            <div key={a.label} className="quick-card" onClick={() => navigate(a.path)}>
              <div className={`quick-card-icon ${a.color}`} style={{
                background: `rgba(${colorToRgb(a.color)},0.15)`,
                color: `var(--${a.color === 'accent' ? 'accent-light' : a.color})`,
              }}>
                <a.icon size={20} />
              </div>
              <span className="quick-card-label">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lotteries Overview */}
      <div style={{ marginTop: 28 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Draws History</div>
            <div className="section-sub">Current and past weekly draws</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/lotteries?tab=history')}>
            <Eye size={13} /> View All <ArrowRight size={12} />
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lottery</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Pending</th>
                <th>Revenue</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockLotteries.map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, var(--bg-elevated), var(--accent-glow))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)', flexShrink: 0 }}>
                        <Award size={18} />
                      </div>
                      <span className="td-primary" style={{ fontSize: 13 }}>{l.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${l.status}`}>{l.status}</span>
                  </td>
                  <td className="td-primary">{l.participants}</td>
                  <td>
                    {l.pendingApprovals > 0 ? (
                      <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{l.pendingApprovals}</span>
                    ) : '—'}
                  </td>
                  <td className="td-primary">{l.revenue.toLocaleString()} CDF</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.endDate}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/lotteries/${l.id}`)}>
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function colorToRgb(c) {
  const map = { accent: '124,58,237', gold: '245,158,11', green: '16,185,129', blue: '59,130,246', red: '239,68,68', pink: '236,72,153' }
  return map[c] || '124,58,237'
}
