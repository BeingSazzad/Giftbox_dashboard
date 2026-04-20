import { useState, useRef } from 'react'
import {
  DollarSign, Phone, Bell, RefreshCw, Shield, Globe,
  Save, AlertTriangle, Clock, CheckCircle, Users, Plus, Trash2
} from 'lucide-react'

const SETTINGS_SECTIONS = [
  { key: 'platform', label: 'Platform Defaults', icon: Globe, color: 'var(--gold)' },
  { key: 'payments', label: 'Payment Numbers', icon: Phone, color: 'var(--green)' },
  { key: 'notifications', label: 'Notifications', icon: Bell, color: 'var(--accent-light)' },
  { key: 'team', label: 'Team Management', icon: Users, color: 'var(--primary)' },
  { key: 'security', label: 'Profile & Security', icon: Shield, color: 'var(--blue)' },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('platform')
  const [paymentNums, setPaymentNums] = useState(['+243 810 000 001', '+243 820 000 002'])
  const [adminAvatar, setAdminAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const [team, setTeam] = useState([
    { id: 1, name: 'Main Admin', email: 'admin@giftbox.cd', role: 'Owner' },
    { id: 2, name: 'Tech Support', email: 'support@giftbox.cd', role: 'Support' }
  ]);
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' })
  const [currency, setCurrency] = useState('CDF')
  const [saved, setSaved] = useState(false)
  const [toggles, setToggles] = useState({
    emailNotif: true,
    smsNotif: true,
    twoFactor: true,
    autoClose: false,
    maintenanceMode: false,
  })

  const toggleSwitch = (key) => setToggles(t => ({ ...t, [key]: !t[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return
    setTeam(prev => [...prev, { id: Date.now(), ...newAdmin }])
    setShowAddAdmin(false)
    setNewAdmin({ name: '', email: '', role: 'Admin' })
  }

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">System Settings</div>
          <div className="section-sub">Configure lottery system defaults and preferences</div>
        </div>
        <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save All Settings</>}
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 10, padding: '12px 18px', marginBottom: 22, fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={15} /> Settings saved successfully.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22, alignItems: 'start' }}>
        {/* Section Sidebar */}
        <div className="card" style={{ padding: '8px 0' }}>
          {SETTINGS_SECTIONS.map(s => (
            <div
              key={s.key}
              className={`cms-nav-item ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}
              style={{ borderRadius: 0 }}
            >
              <s.icon size={16} style={{ color: activeSection === s.key ? s.color : 'var(--text-muted)' }} />
              {s.label}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ paddingBottom: 40 }}>
          {activeSection === 'platform' && (
      <div className="settings-block">
        <div className="settings-block-header">
          <Globe size={16} style={{ color: 'var(--gold)' }} />
          Platform Defaults
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Currency</div>
            <div className="settings-row-desc">System-wide currency display</div>
          </div>
          <select
            className="form-select"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{ width: 130 }}
          >
            <option value="CDF">CDF — Congolese Franc</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
      </div>
          )}

          {activeSection === 'payments' && (
      <div className="settings-block">
        <div className="settings-block-header">
          <Phone size={16} style={{ color: 'var(--green)' }} />
          Payment Numbers
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>Displayed to users for mobile money payments</span>
        </div>
        {paymentNums.map((num, i) => (
          <div key={i} className="settings-row">
            <div>
              <div className="settings-row-label">Payment Number {i + 1}</div>
              <div className="settings-row-desc">{i === 0 ? 'M-Pesa primary number' : 'Orange Money number'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                className="form-input"
                value={num}
                onChange={e => setPaymentNums(ns => ns.map((n, j) => j === i ? e.target.value : n))}
                style={{ width: 200 }}
                placeholder="+243 XXX XXX XXX"
              />
            </div>
          </div>
        ))}
        <div className="settings-row" style={{ borderBottom: 'none' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            ⚠ Changing payment numbers will update them immediately in the user app. Notify users before changing.
          </div>
        </div>
      </div>
          )}

          {activeSection === 'notifications' && (
      <div className="settings-block">
        <div className="settings-block-header">
          <Bell size={16} style={{ color: 'var(--accent-light)' }} />
          Notification Settings
        </div>
        {[
          { key: 'smsNotif', label: 'SMS Notifications', desc: 'Send SMS alerts to users for payment status and results' },
          { key: 'emailNotif', label: 'Email Notifications', desc: 'Send email updates for admin actions and reports' },
        ].map(n => (
          <div key={n.key} className="settings-row">
            <div>
              <div className="settings-row-label">{n.label}</div>
              <div className="settings-row-desc">{n.desc}</div>
            </div>
            <div className={`toggle ${toggles[n.key] ? 'on' : ''}`} onClick={() => toggleSwitch(n.key)} />
          </div>
        ))}
      </div>
          )}

          {activeSection === 'team' && (
      <div className="settings-block">
        <div className="settings-block-header">
          <Users size={16} style={{ color: 'var(--primary)' }} />
          Team Management
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowAddAdmin(true)}>
            <Plus size={13} /> Add Admin
          </button>
        </div>
        <div style={{ padding: '4px 20px 20px 20px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Manage dashboard access for your team. Owners have full control over the system.
          </div>
          <div className="table-wrap">
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {team.map(member => (
                  <tr key={member.id}>
                    <td style={{ fontWeight: 600 }}>{member.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{member.email}</td>
                    <td>
                      <span className={`badge ${member.role === 'Owner' ? 'badge-active' : 'badge-draft'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 6, opacity: member.role === 'Owner' ? 0.3 : 1 }}>
                        <Trash2 size={14} style={{ color: 'var(--red)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
          )}

          {activeSection === 'security' && (
      <div className="settings-block">
        <div className="settings-block-header">
          <Shield size={16} style={{ color: 'var(--blue)' }} />
          Security & Profile
        </div>
        
        {/* Profile Picture */}
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Admin Profile Picture</div>
            <div className="settings-row-desc">Update your display photo</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="admin-avatar" style={{ width: 50, height: 50, fontSize: 18, overflow: 'hidden' }}>
              {adminAvatar ? <img src={adminAvatar} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'AD'}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              Upload New
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setAdminAvatar(URL.createObjectURL(e.target.files[0]));
              }
            }} />
          </div>
        </div>

        {[
          { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins (recommended)' },
          { key: 'autoClose', label: 'Auto-close Lotteries', desc: 'Automatically close lotteries when deadline is reached' },
        ].map(s => (
          <div key={s.key} className="settings-row">
            <div>
              <div className="settings-row-label">{s.label}</div>
              <div className="settings-row-desc">{s.desc}</div>
            </div>
            <div className={`toggle ${toggles[s.key] ? 'on' : ''}`} onClick={() => toggleSwitch(s.key)} />
          </div>
        ))}

        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--bg-card)', borderRadius: '50%', border: '1px solid var(--border)' }}>
              <Shield size={18} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <div className="settings-row-label" style={{ fontSize: 14 }}>Change Admin Password</div>
              <div className="settings-row-desc">Ensure your account uses a strong, secure password. Last changed 30 days ago.</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 380, marginLeft: 50 }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" placeholder="••••••••" style={{ letterSpacing: 2 }} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="••••••••" style={{ letterSpacing: 2 }} />
              <div className="form-hint">Must be at least 8 characters tracking letters and numbers.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="••••••••" style={{ letterSpacing: 2 }} />
            </div>
            <div style={{ marginTop: 6 }}>
              <button className="btn btn-primary">Update Password</button>
            </div>
          </div>
        </div>
      </div>
          )}
        </div>
      </div>

      {/* Version Info */}
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-tiny)', marginTop: 8 }}>
        GiftBox Admin v1.0.0 · Build 2026.04.20 · Environment: Production
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal-overlay" onClick={() => setShowAddAdmin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Invite New Admin</span>
              <button className="modal-close" onClick={() => setShowAddAdmin(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                They will receive an email instruction with a temporary password to access the dashboard.
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. John Doe" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="john@giftbox.cd" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">System Role</label>
                <select className="form-select" value={newAdmin.role} onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value })}>
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Support">Support (Read Only / Approvals)</option>
                  <option value="Finance">Finance (Revenue Access Only)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAddAdmin(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddAdmin} disabled={!newAdmin.name || !newAdmin.email}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
