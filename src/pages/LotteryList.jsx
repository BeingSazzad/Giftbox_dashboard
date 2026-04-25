import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit, Pause, X, RefreshCw, Gift, Users, Clock, Award } from 'lucide-react'
import { mockLotteries } from '../data/mockData'

const FILTERS = ['All', 'active', 'scheduled', 'drawing', 'completed', 'draft']

export default function LotteryList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [activeTab, setActiveTab] = useState(new URLSearchParams(window.location.search).get('tab') === 'history' ? 'history' : 'management')
  const [search, setSearch] = useState('')

  const statusOrder = { drawing: 1, locked: 2, active: 3, scheduled: 4, draft: 5, completed: 6 }

  const filtered = mockLotteries.filter(l => {
    const matchStatus = filter === 'All' || l.status === filter
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  }).sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99))

  return (
    <div>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Lottery Dashboard</div>
          <div className="section-sub">Manage active lotteries and view past draw results</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/lotteries/create')}>
          <Plus size={15} /> Create Lottery
        </button>
      </div>

      <div className="tabs mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <button className={`tab-btn ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>
          Lottery Management
        </button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Draw History
        </button>
      </div>

      {activeTab === 'management' ? (
        <>
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
          {filtered.filter(l => l.status !== 'completed').length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Gift size={48} style={{ opacity: 0.2 }} /></div>
              <div className="empty-title">No active lotteries found</div>
              <div className="empty-text">Try adjusting your filter or create a new lottery.</div>
            </div>
          ) : (
            <div className="lottery-grid">
              {filtered.filter(l => l.status !== 'completed').map(l => (
                <LotteryCard key={l.id} lottery={l} onView={() => navigate(`/lotteries/${l.id}`)} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lottery</th>
                <th>Winner</th>
                <th>Participants</th>
                <th>Revenue</th>
                <th>Closed Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockLotteries.filter(l => l.status === 'completed').map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
                        <Award size={16} />
                      </div>
                      <span className="td-primary">{l.title}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center -space-x-2">
                      {l.winners?.slice(0, 3).map((w, idx) => (
                        <img 
                          key={idx} 
                          src={w.avatar} 
                          alt={w.name} 
                          title={w.name}
                          style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--bg-card)', position: 'relative', marginLeft: idx > 0 ? -8 : 0 }} 
                        />
                      ))}
                      {l.winners?.length > 3 && (
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-elevated)', border: '2px solid var(--bg-card)', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginLeft: -8 }}>
                          +{l.winners.length - 3}
                        </div>
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--gold)', marginLeft: 8 }}>
                        {l.winners?.length === 1 ? l.winners[0].name : `${l.winners?.length} Winners`}
                      </span>
                    </div>
                  </td>
                  <td>{l.participants}</td>
                  <td>{l.revenue.toLocaleString()} CDF</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.endDate}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/lotteries/${l.id}`)}>
                      <Eye size={12} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          color: 'var(--text-muted)', opacity: 0.8
        }}>
          <Gift size={64} strokeWidth={1} />
        </div>
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
            <Users size={12} style={{ color: 'var(--text-muted)' }} /> <strong>{l.participants}</strong> participants
          </div>
          {l.pendingApprovals > 0 && (
            <div className="lottery-stat" style={{ color: 'var(--gold)' }}>
              <Clock size={12} /> <strong>{l.pendingApprovals}</strong> pending
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
