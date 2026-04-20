import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit, Pause, X, RefreshCw } from 'lucide-react'
import { mockLotteries } from '../data/mockData'

const FILTERS = ['All', 'active', 'closed', 'completed', 'draft']

export default function LotteryList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = mockLotteries.filter(l => {
    const matchStatus = filter === 'All' || l.status === filter
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Lottery Management</div>
          <div className="section-sub">{mockLotteries.length} total lotteries in system</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/lotteries/create')}>
          <Plus size={15} /> Create Lottery
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        <div className="search-box" style={{ width: 260 }}>
          <Search size={14} className="search-icon" />
          <input placeholder="Search lotteries..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="tabs">
          {FILTERS.map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <div className="empty-title">No lotteries found</div>
          <div className="empty-text">Try adjusting your filter or create a new lottery.</div>
        </div>
      ) : (
        <div className="lottery-grid">
          {filtered.map(l => (
            <LotteryCard key={l.id} lottery={l} onView={() => navigate(`/lotteries/${l.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}

function LotteryCard({ lottery: l, onView }) {
  const navigate = useNavigate()
  const daysLeft = Math.max(0, Math.ceil((new Date(l.endDate) - new Date()) / 86400000))

  return (
    <div className="lottery-card">
      <div className="lottery-banner">
        {/* Gradient banner */}
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, var(--bg-elevated), ${bannerGrad(l.id)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48,
        }}>🎁</div>
        <div className="lottery-banner-overlay" />
        <div className="lottery-banner-badge">
          <span className={`badge badge-${l.status}`}>{l.status}</span>
        </div>
        {l.status !== 'draft' && (
          <div className="lottery-countdown-badge">
            {l.status === 'completed' ? '✓ Ended' : `${daysLeft}d left`}
          </div>
        )}
      </div>

      <div className="lottery-body">
        <div className="lottery-title">{l.title}</div>
        <div className="lottery-meta">
          <div className="lottery-stat">
            👥 <strong>{l.participants}</strong> participants
          </div>
          {l.pendingApprovals > 0 && (
            <div className="lottery-stat" style={{ color: 'var(--gold)' }}>
              ⏳ <strong>{l.pendingApprovals}</strong> pending
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          Revenue: <strong style={{ color: 'var(--text-secondary)' }}>{l.revenue.toLocaleString()} CDF</strong>
        </div>
        <div className="lottery-actions" style={{ marginTop: 10 }}>
          <button 
            className={`btn ${l.status === 'active' ? 'btn-primary' : 'btn-ghost'} btn-sm`} 
            style={{ width: '100%', justifyContent: 'center', padding: '9px 0' }} 
            onClick={onView}
          >
            {l.status === 'completed' || l.status === 'closed' ? 'View Results' : 'Manage Lottery'}
          </button>
        </div>
      </div>
    </div>
  )
}

function bannerGrad(id) {
  const grads = { '1': 'rgba(124,58,237,.4)', '2': 'rgba(59,130,246,.3)', '3': 'rgba(16,185,129,.3)', '4': 'rgba(245,158,11,.25)' }
  return grads[id] || 'rgba(124,58,237,.3)'
}
