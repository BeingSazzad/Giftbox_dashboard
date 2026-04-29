import { useState } from 'react'
import { Save, Plus, Trash2, Edit, ChevronDown, ChevronUp, FileText, Shield, Info, HelpCircle } from 'lucide-react'

const CMS_SECTIONS = [
  { key: 'terms', label: 'Terms & Conditions', icon: FileText, color: 'var(--accent-light)' },
  { key: 'privacy', label: 'Privacy Policy', icon: Shield, color: 'var(--blue)' },
  { key: 'about', label: 'About Us', icon: Info, color: 'var(--gold)' },
  { key: 'faq', label: 'FAQ Manager', icon: HelpCircle, color: 'var(--green)' },
]

const DEFAULT_CONTENT = {
  terms: `# Terms & Conditions\n\nLast updated: April 20, 2026\n\n## 1. Participation\nBy purchasing a ticket, participants agree to abide by all lottery rules and regulations set by GiftBox.\n\n## 2. Payment\nAll ticket payments must be made via approved mobile money channels. Proof of payment is required.\n\n## 3. Winner Selection\nWinners are selected randomly from all approved participants. The decision of the admin is final.\n\n## 4. Prize Collection\nWinners will be contacted within 48 hours. Prizes must be claimed within 30 days.`,
  privacy: `# Privacy Policy\n\nLast updated: April 20, 2026\n\nGiftBox is committed to protecting your personal information.\n\n## Data We Collect\n- Name and phone number\n- City of residence\n- Payment transaction references\n- Participation history\n\n## How We Use Your Data\nYour data is used solely for lottery management and winner notification. We do not sell or share your information with third parties.`,
  about: `# About GiftBox\n\nGiftBox is the Democratic Republic of Congo's premier mobile lottery platform, connecting thousands of participants with life-changing prizes every month.\n\n## Our Mission\nTo create fair, transparent, and exciting lottery experiences that bring joy to communities across the DRC.\n\n## Built on Trust\nEvery lottery is managed with strict verification processes ensuring only eligible participants enter the prize pool.`,
}

const DEFAULT_FAQS = [
  { id: '1', q: 'How do I participate in a lottery?', a: 'Download the GiftBox app, register with your phone number, select an active lottery, and pay for your ticket via M-Pesa or Orange Money.', open: false },
  { id: '2', q: 'What payment methods are accepted?', a: 'We accept M-Pesa and Orange Money. After payment, upload your proof of payment in the app.', open: false },
  { id: '3', q: 'How is the winner selected?', a: 'Winners are chosen using a certified random selection tool from all approved participants only.', open: false },
  { id: '4', q: 'How will I know if I win?', a: 'Winners are notified via SMS and a notification in the GiftBox app. Results are also published in the app.', open: false },
  { id: '5', q: 'Can I buy multiple tickets?', a: 'Yes! You can buy up to 10 tickets per lottery, increasing your chances of winning.', open: false },
]

export default function CMS() {
  const [activeSection, setActiveSection] = useState('terms')
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [faqs, setFaqs] = useState(DEFAULT_FAQS)
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [faqOpen, setFaqOpen] = useState(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addFaq = () => {
    if (!newQ || !newA) return
    setFaqs(f => [...f, { id: Date.now().toString(), q: newQ, a: newA, open: false }])
    setNewQ(''); setNewA('')
  }

  const deleteFaq = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ? This cannot be undone.')) {
      setFaqs(f => f.filter(faq => faq.id !== id))
    }
  }

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Content Management</div>
          <div className="section-sub">Manage all public-facing content</div>
        </div>
        <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save & Publish'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22, alignItems: 'start' }}>
        {/* Section Sidebar */}
        <div className="card" style={{ padding: '8px 0' }}>
          {CMS_SECTIONS.map(s => (
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
        <div>
          {activeSection !== 'faq' ? (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {CMS_SECTIONS.find(s => s.key === activeSection)?.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last updated: April 20, 2026 · Version 1.0</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm">Version History</button>
                  <button className="btn btn-outline btn-sm"><Edit size={12} /> Preview</button>
                </div>
              </div>

              {/* Toolbar */}
              <div className="cms-toolbar mb-3">
                {['B', 'I', 'U', 'H1', 'H2', '—', '• List', '# Link'].map(tool => (
                  <button key={tool} className="cms-tool-btn" title={tool}>{tool}</button>
                ))}
              </div>

              <textarea
                className="cms-editor form-textarea"
                value={content[activeSection]}
                onChange={e => setContent(c => ({ ...c, [activeSection]: e.target.value }))}
                rows={18}
                style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}
              />

              <div className="flex items-center justify-between mt-4">
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {content[activeSection]?.length} characters · Draft saved automatically
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm">Reset to Default</button>
                </div>
              </div>
            </div>
          ) : (
            /* FAQ Manager */
            <div>
              {/* Add new FAQ */}
              <div className="card" style={{ padding: 22, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={16} style={{ color: 'var(--green)' }} /> Add New FAQ
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Question</label>
                    <input className="form-input" placeholder="e.g. How do I participate?" value={newQ} onChange={e => setNewQ(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Answer</label>
                    <textarea className="form-textarea" placeholder="Provide a clear, helpful answer..." value={newA} onChange={e => setNewA(e.target.value)} rows={3} />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={addFaq} disabled={!newQ || !newA}>
                      <Plus size={14} /> Add FAQ
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {faqs.map(faq => (
                  <div key={faq.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div
                      style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                      onClick={() => setFaqOpen(faqOpen === faq.id ? null : faq.id)}
                    >
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{faq.q}</span>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation() }}>
                          <Edit size={12} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); deleteFaq(faq.id) }}>
                          <Trash2 size={12} />
                        </button>
                        {faqOpen === faq.id ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    </div>
                    {faqOpen === faq.id && (
                      <div style={{ padding: '0 18px 16px 18px', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
