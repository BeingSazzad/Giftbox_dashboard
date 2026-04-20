import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Eye, UserX, RotateCcw, Download } from 'lucide-react'
import { mockUsers } from '../data/mockData'

export default function Users() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const cities = ['All', ...new Set(mockUsers.map(u => u.city))]

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
    const matchCity = cityFilter === 'All' || u.city === cityFilter
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    return matchSearch && matchCity && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">User Management</div>
          <div className="section-sub">{mockUsers.length} registered users</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><Download size={13} /> Export</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: mockUsers.length, color: 'var(--accent-light)' },
          { label: 'Active', value: mockUsers.filter(u => u.status === 'active').length, color: 'var(--green)' },
          { label: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length, color: 'var(--red)' },
          { label: 'Winners', value: mockUsers.filter(u => u.wins > 0).length, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
        <div className="search-box" style={{ width: 280 }}>
          <Search size={14} className="search-icon" />
          <input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto', padding: '8px 14px' }} value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="tabs">
          {['All', 'active', 'suspended'].map(s => (
            <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Tickets</th>
              <th>Wins</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${Number(u.id)*47},70%,45%), hsl(${Number(u.id)*90},60%,35%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <span className="td-primary">{u.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{u.phone}</td>
                <td>{u.city}</td>
                <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{u.tickets}</td>
                <td>
                  {u.wins > 0
                    ? <span style={{ color: 'var(--gold)', fontWeight: 700 }}>🏆 {u.wins}</span>
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>
                  }
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.joined}</td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-rejected'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/users/${u.id}`)}>
                      <Eye size={12} />
                    </button>
                    <button className="btn btn-danger btn-sm" title={u.status === 'active' ? 'Suspend' : 'Unsuspend'}>
                      <UserX size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No users found</div></div>
        )}
      </div>
    </div>
  )
}
