import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Upload, Save, Send, Image, Tag, DollarSign, Calendar, Check } from 'lucide-react'

const STEPS = ['Basic Info', 'Pricing', 'Schedule', 'Publish']

export default function LotteryCreate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '', description: '', banner: null,
    ticketPrice: 2500,
    publishInstantly: true,
    startDate: '', endDate: '',
    status: 'draft',
  })
  const [published, setPublished] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePublish = (isDraft) => {
    update('status', isDraft ? 'draft' : 'active')
    setPublished(true)
    setTimeout(() => navigate('/lotteries'), 1800)
  }

  if (published) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16, animation: 'pulse 1s ease' }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            {form.status === 'active' ? 'Lottery Published!' : 'Saved as Draft!'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Redirecting to lottery list...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/lotteries')}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          {/* TODO:: need to desing this */}
          <div className="section-title">Create New Lottery</div>
          <div className="section-sub">Step {step + 1} of {STEPS.length}</div>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper mb-6">
        {STEPS.map((s, i) => (
          <>
            <div key={s} className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-num">{i < step ? <Check size={12} /> : i + 1}</div>
              <span style={{ display: window.innerWidth > 600 ? 'block' : 'none' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
          </>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ padding: 28 }}>
        {step === 0 && <StepBasicInfo form={form} update={update} />}
        {step === 1 && <StepPricing form={form} update={update} />}
        {step === 2 && <StepSchedule form={form} update={update} />}
        {step === 3 && <StepPublish form={form} onDraft={() => handlePublish(true)} onPublish={() => handlePublish(false)} />}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-4">
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft size={14} /> Previous
          </button>
          <button className="btn btn-primary" onClick={() => setStep(s => Math.min(3, s + 1))}>
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

function StepBasicInfo({ form, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 36, height: 36, background: 'rgba(124,58,237,.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tag size={18} style={{ color: 'var(--accent-light)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Basic Information</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Give your lottery a name and compelling description</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Lottery Title *</label>
        <input className="form-input" placeholder="e.g. iPhone 15 Pro Max Giveaway" value={form.title} onChange={e => update('title', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" placeholder="Describe the lottery, prize details, rules..." value={form.description} onChange={e => update('description', e.target.value)} rows={4} />
      </div>

      <div className="form-group">
        <label className="form-label">Banner Image</label>
        <div className="upload-zone" onClick={() => {}}>
          <div className="upload-icon"><Image size={32} /></div>
          <div className="upload-text">
            <strong>Click to upload</strong> or drag & drop<br />
            <span style={{ fontSize: 11 }}>Recommended: 1200×400px · JPG, PNG, WebP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepPricing({ form, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 36, height: 36, background: 'rgba(16,185,129,.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DollarSign size={18} style={{ color: 'var(--green)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Ticket Pricing</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Set the cost per lottery ticket in CDF</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ticket Price (CDF)</label>
        <div style={{ position: 'relative' }}>
          <input
            className="form-input"
            type="number"
            placeholder="2500"
            value={form.ticketPrice}
            onChange={e => update('ticketPrice', Number(e.target.value))}
            style={{ paddingLeft: 56 }}
          />
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>CDF</span>
        </div>
        <div className="form-hint">Default system price is 2,500 CDF</div>
      </div>

      {/* Revenue preview */}
      <div style={{ background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>Revenue Projection</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {[100, 250, 500].map(n => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)', fontFamily: "'Space Grotesk',sans-serif" }}>
                {(n * form.ticketPrice).toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }} >at {n} tickets</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepSchedule({ form, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 36, height: 36, background: 'rgba(59,130,246,.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={18} style={{ color: 'var(--blue)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Lottery Schedule</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Define the participation window</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Release Strategy</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className={`proof-card ${form.publishInstantly ? 'active' : ''}`} style={{ borderColor: form.publishInstantly ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', padding: 14 }} onClick={() => update('publishInstantly', true)}>
            <div style={{ fontSize: 14, fontWeight: 700, color: form.publishInstantly ? 'var(--primary)' : 'var(--text-primary)' }}>🚀 Publish Instantly</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Lottery starts taking entries immediately after creation</div>
          </div>
          <div className={`proof-card ${!form.publishInstantly ? 'active' : ''}`} style={{ borderColor: !form.publishInstantly ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', padding: 14 }} onClick={() => update('publishInstantly', false)}>
            <div style={{ fontSize: 14, fontWeight: 700, color: !form.publishInstantly ? 'var(--primary)' : 'var(--text-primary)' }}>📅 Schedule Publish</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Select a specific start date in the future</div>
          </div>
        </div>
      </div>

      <div className="form-grid">
        {!form.publishInstantly && (
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input className="form-input" type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
          </div>
        )}
        <div className="form-group" style={{ gridColumn: form.publishInstantly ? 'span 2' : 'auto' }}>
          <label className="form-label">End Date (Deadline) *</label>
          <input className="form-input" type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} />
        </div>
      </div>

      {form.startDate && form.endDate && (
        <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 12, padding: '14px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>⏱ Duration</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)} days participation window
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>⚠ Important Notes</div>
        <ul style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Lottery becomes visible to users only after publishing</li>
          <li>End date locks new participant entries automatically</li>
          <li>Only approved participants qualify for winner selection</li>
        </ul>
      </div>
    </div>
  )
}

function StepPublish({ form, onDraft, onPublish }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Ready to Launch?</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Review your lottery before publishing</div>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: 'Title', value: form.title || '(not set)' },
          { label: 'Ticket Price', value: `${form.ticketPrice?.toLocaleString()} CDF` },
          { label: 'Start Time', value: form.publishInstantly ? 'Instantly after publish' : (form.startDate || '(not set)') },
          { label: 'End Date', value: form.endDate || '(not set)' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={onDraft}>
          <Save size={15} /> Save as Draft
        </button>
        <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={onPublish}>
          <Send size={15} /> Publish Lottery
        </button>
      </div>
    </div>
  )
}
