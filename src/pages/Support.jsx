import { useState } from 'react'
import { Search, Plus, MessageSquare, Clock, CheckCircle, Ticket, ArrowUpRight, X, Inbox, Users } from 'lucide-react'
import { mockMessages } from '../data/mockData'

export default function Support() {
  const [messages, setMessages] = useState(mockMessages)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = messages.filter(m => {
    const matchSearch = m.user.toLowerCase().includes(search.toLowerCase()) || 
                        m.issue.toLowerCase().includes(search.toLowerCase()) ||
                        m.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || m.status === filter.toLowerCase().replace(' ', '-')
    return matchSearch && matchFilter
  })

  const markResolved = (id) => {
    setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'resolved' } : m))
    setSelectedTicket(prev => prev?.id === id ? { ...prev, status: 'resolved' } : prev)
  }
  const reopenTicket = (id) => {
    setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'open' } : m))
    setSelectedTicket(prev => prev?.id === id ? { ...prev, status: 'open' } : prev)
  }

  const statCards = [
    { label: 'Total Tickets', value: messages.length, icon: Ticket, color: 'accent', badge: 'All Time', badgeClass: 'badge-primary' },
    { label: 'Open Tickets', value: messages.filter(m => m.status === 'open').length, icon: Inbox, color: 'gold', badge: 'Awaiting', badgeClass: 'badge-pending' },
    { label: 'In Progress', value: messages.filter(m => m.status === 'in-progress').length, icon: Clock, color: 'blue', badge: 'Active', badgeClass: 'badge-info' },
    { label: 'Resolved', value: messages.filter(m => m.status === 'resolved').length, icon: CheckCircle, color: 'green', badge: 'Closed', badgeClass: 'badge-active' },
  ]

  const getPriorityColor = (p) => {
    if (p === 'High') return 'var(--red)'
    if (p === 'Medium') return 'var(--gold)'
    return 'var(--text-muted)'
  }
  const getPriorityBg = (p) => {
    if (p === 'High') return 'rgba(239,68,68,.1)'
    if (p === 'Medium') return 'rgba(245,158,11,.1)'
    return 'var(--bg-elevated)'
  }

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Support</div>
          <div className="section-sub">Manage help requests and assist users with issues</div>
        </div>
        <button className="btn btn-primary">
          <Plus size={15} /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 30 }}>
        {statCards.map(s => (
          <div key={s.label} className={`metric-card ${s.color}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: '20px 16px' }}>
            <div className={`metric-icon ${s.color}`} style={{ width: 48, height: 48, flexShrink: 0 }}>
              <s.icon size={22} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="metric-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.label}
              </div>
              <div className="metric-value" style={{ fontSize: '26px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {s.value}
              </div>
            </div>
            <div className={`badge ${s.badgeClass}`} style={{ alignSelf: 'flex-start', padding: '2px 8px', fontSize: 9, borderRadius: 6, position: 'absolute', top: 12, right: 12 }}>
              {s.badge}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6" style={{ justifyContent: 'space-between' }}>
        <div className="tabs">
          {['All', 'Open', 'In Progress', 'Resolved'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="search-box" style={{ width: 300, background: 'var(--bg-card)' }}>
          <Search size={14} className="search-icon" />
          <input placeholder="Search by ID, subject, user..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table style={{ minWidth: 1000 }}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>TICKET</th>
              <th style={{ width: 220 }}>USER</th>
              <th>ISSUE SUBJECT</th>
              <th style={{ width: 100, textAlign: 'center' }}>PRIORITY</th>
              <th style={{ width: 140, textAlign: 'center' }}>STATUS</th>
              <th style={{ width: 100, textAlign: 'right' }}>UPDATED</th>
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
             {filtered.map(m => (
              <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTicket(m)}>
                <td style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{m.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{m.user}</div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{m.issue}</div>
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <span style={{ padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: getPriorityBg(m.priority), color: getPriorityColor(m.priority) }}>
                    {m.priority}
                  </span>
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <span className={`badge ${m.status === 'resolved' ? 'badge-active' : m.status === 'open' ? 'badge-pending' : m.status === 'in-progress' ? 'badge-info' : 'badge-primary'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor' }} />
                    {m.status === 'in-progress' ? 'In Progress' : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 500 }}>{m.time}</td>
                <td style={{ textAlign: 'right' }}><ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><MessageSquare /></div>
            <div className="empty-title">No tickets found</div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal" style={{ maxWidth: 650, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{selectedTicket.id}</span>
                  <span className={`badge ${selectedTicket.status === 'resolved' ? 'badge-active' : selectedTicket.status === 'open' ? 'badge-pending' : 'badge-primary'}`}>
                    {selectedTicket.status === 'in-progress' ? 'In Progress' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                  </span>
                </div>
                <button className="modal-close" onClick={() => setSelectedTicket(null)}><X size={16} /></button>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{selectedTicket.issue}</h2>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={12} /> {selectedTicket.user}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={12} /> {selectedTicket.date}</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px', background: 'var(--bg-elevated)', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <img src={selectedTicket.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{selectedTicket.user}</div>
                  <div style={{ 
                    background: 'var(--bg-card)', padding: '16px 20px', borderRadius: '0 12px 12px 12px',
                    border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6
                  }}>
                    {selectedTicket.preview}
                    {selectedTicket.attachment && (
                      <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Attachment</div>
                        <img src={selectedTicket.attachment} alt="Attachment" style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8, border: '1px solid var(--border)', objectFit: 'contain', background: 'var(--bg-card)' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{selectedTicket.date}</div>
                </div>
              </div>
            </div>

            {/* Footer / Reply Action */}
            <div style={{ padding: '24px 28px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)' }}>
              {selectedTicket.status === 'resolved' ? (
                <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green)', fontWeight: 600 }}>
                    <CheckCircle size={18} /> This ticket is resolved
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => reopenTicket(selectedTicket.id)}>
                    Reopen
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                  <textarea className="form-textarea" placeholder="Type your reply here..." style={{ minHeight: 100 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reply will be sent via App Push Notification</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn btn-ghost" onClick={() => markResolved(selectedTicket.id)}>Mark Resolved</button>
                      <button className="btn btn-primary" onClick={() => markResolved(selectedTicket.id)}>Send Reply</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
