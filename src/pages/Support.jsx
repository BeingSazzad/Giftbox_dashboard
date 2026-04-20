import { useState } from 'react'
import { Search, Send, CheckCircle, AlertTriangle, ArrowUp, X } from 'lucide-react'
import { mockMessages } from '../data/mockData'

export default function Support() {
  const [messages, setMessages] = useState(mockMessages)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const selectedMsg = messages.find(m => m.id === selected)

  const filtered = messages.filter(m => {
    const matchSearch = m.user.toLowerCase().includes(search.toLowerCase()) || m.issue.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || (filter === 'Unread' ? m.status === 'unread' : m.status === 'resolved')
    return matchSearch && matchFilter
  })

  const markResolved = (id) => setMessages(ms => ms.map(m => m.id === id ? { ...m, status: 'resolved' } : m))

  const chatThread = [
    { from: 'user', text: selectedMsg?.preview, time: selectedMsg?.time },
    { from: 'admin', text: 'Thank you for reaching out. We are looking into this for you.', time: '5 min ago' },
    { from: 'user', text: 'Please check urgently, I have been waiting for 2 days already.', time: '3 min ago' },
  ]

  return (
    <div>
      <div className="section-header mb-5">
        <div>
          <div className="section-title">Support Inbox</div>
          <div className="section-sub">{messages.filter(m => m.status === 'unread').length} unread messages</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Messages', value: messages.length, color: 'var(--accent-light)' },
          { label: 'Unread', value: messages.filter(m => m.status === 'unread').length, color: 'var(--gold)' },
          { label: 'Resolved', value: messages.filter(m => m.status === 'resolved').length, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Message List */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div className="search-box" style={{ width: '100%', marginBottom: 10 }}>
              <Search size={13} className="search-icon" />
              <input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="tabs">
              {['All', 'Unread', 'Resolved'].map(f => (
                <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ padding: '6px 12px', fontSize: 11 }}>{f}</button>
              ))}
            </div>
          </div>

          <div className="message-list">
            {filtered.map(m => (
              <div
                key={m.id}
                className={`message-row ${m.status === 'unread' ? 'unread' : ''} ${selected === m.id ? 'active' : ''}`}
                onClick={() => setSelected(m.id)}
                style={{ background: selected === m.id ? 'rgba(124,58,237,.12)' : '' }}
              >
                <div className="msg-avatar">{m.user.charAt(0)}</div>
                <div className="msg-info">
                  <div className="flex items-center gap-2">
                    <span className="msg-name">{m.user}</span>
                    {m.status === 'unread' && (
                      <span style={{ width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--accent-light)', fontWeight: 600, marginBottom: 2 }}>{m.issue}</div>
                  <div className="msg-preview">{m.preview}</div>
                </div>
                <div className="msg-meta">
                  <div className="msg-time">{m.time}</div>
                  {m.status === 'resolved' && <CheckCircle size={12} style={{ color: 'var(--green)', marginLeft: 'auto', marginTop: 4 }} />}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state" style={{ padding: 30 }}>
                <div className="empty-icon">💬</div>
                <div className="empty-title" style={{ fontSize: 14 }}>No messages</div>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        {selectedMsg ? (
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: 520 }}>
            {/* Detail Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="msg-avatar">{selectedMsg.user.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedMsg.user}</div>
                <div style={{ fontSize: 12, color: 'var(--accent-light)' }}>{selectedMsg.issue}</div>
                {selectedMsg.lottery !== '-' && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Lottery: {selectedMsg.lottery}</div>
                )}
              </div>
              <div className="flex gap-2">
                <span className={`badge ${selectedMsg.status === 'unread' ? 'badge-pending' : 'badge-active'}`}>
                  {selectedMsg.status}
                </span>
                {selectedMsg.status === 'unread' && (
                  <button className="btn btn-success btn-sm" onClick={() => markResolved(selectedMsg.id)}>
                    <CheckCircle size={12} /> Resolve
                  </button>
                )}
                <button className="btn btn-outline btn-sm">
                  <AlertTriangle size={12} /> Escalate
                </button>
              </div>
            </div>

            {/* Chat thread */}
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
              {chatThread.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.from === 'admin' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: msg.from === 'admin'
                      ? 'linear-gradient(135deg, var(--accent), #5B21B6)'
                      : 'linear-gradient(135deg, #374151, #1F2937)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {msg.from === 'admin' ? 'A' : selectedMsg.user.charAt(0)}
                  </div>
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{
                      background: msg.from === 'admin' ? 'rgba(124,58,237,.15)' : 'var(--bg-elevated)',
                      border: `1px solid ${msg.from === 'admin' ? 'rgba(124,58,237,.25)' : 'var(--border)'}`,
                      borderRadius: msg.from === 'admin' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                      padding: '10px 14px',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.from === 'admin' ? 'right' : 'left' }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <textarea
                className="form-textarea"
                placeholder="Type your reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={2}
                style={{ flex: 1, resize: 'none', minHeight: 'unset' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-primary" style={{ padding: '10px 16px' }} onClick={() => setReply('')}>
                  <Send size={14} />
                </button>
                <button className="btn btn-ghost" style={{ padding: '10px 16px', fontSize: 11 }}>
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className="empty-state" style={{ padding: 0 }}>
              <div className="empty-icon">💬</div>
              <div className="empty-title">Select a message</div>
              <div className="empty-text">Click any conversation to view and reply</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
