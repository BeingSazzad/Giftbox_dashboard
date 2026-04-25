import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Eye, UserX, Download, Users as UsersIcon, UserCheck, UserMinus, ChevronLeft, ChevronRight } from 'lucide-react'
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [goToPage, setGoToPage] = useState('')

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedList = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
      {/* Stats */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Users', value: mockUsers.length, color: 'accent', icon: UsersIcon },
          { label: 'Active', value: mockUsers.filter(u => u.status === 'active').length, color: 'green', icon: UserCheck },
          { label: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length, color: 'red', icon: UserMinus },
        ].map(s => (
          <div key={s.label} className={`metric-card ${s.color}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: '20px 16px' }}>
            <div className={`metric-icon ${s.color}`} style={{ width: 48, height: 48, flexShrink: 0 }}>
              <s.icon size={22} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="metric-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>
                {s.label}
              </div>
              <div className="metric-value" style={{ fontSize: '26px', fontFamily: 'Space Grotesk, sans-serif' }}>
                {s.value}
              </div>
            </div>
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
            {paginatedList.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(currentPage - 1) * pageSize + i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
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

        {/* Modern Pagination UI */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '20px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
              <span>Show</span>
              <select 
                value={pageSize} 
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
              >
                {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span>entries</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, padding: 0 }}>
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setCurrentPage(i + 1)} style={{ width: 32, height: 32, padding: 0, minWidth: 'auto', fontWeight: 600 }}>{i + 1}</button>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, padding: 0 }}>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Go to</span>
                <input 
                  type="text" 
                  value={goToPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(goToPage)
                      if (val >= 1 && val <= totalPages) { setCurrentPage(val); setGoToPage(''); }
                    }
                  }}
                  style={{ width: 44, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', textAlign: 'center', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No users found</div></div>
        )}
      </div>
    </div>
  )
}
