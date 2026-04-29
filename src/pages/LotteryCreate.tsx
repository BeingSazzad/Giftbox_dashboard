import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  DollarSign,
  Save,
  Send,
  Tag,
} from "lucide-react";
import { LotteryForm } from "../types/LotteryForm";

const STEPS = ["Basic Info", "Pricing", "Schedule", "Publish"];

export default function LotteryCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LotteryForm>({
    title: "",
    description: "",
    banner: null,
    ticketPrice: 2500,
    publishInstantly: true,
    startDate: "",
    endDate: "",
    status: "draft",
  });
  const [published, setPublished] = useState(false);

  const update = <K extends keyof LotteryForm>(k: K, v: LotteryForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handlePublish = (isDraft: boolean) => {
    update("status", isDraft ? "draft" : "active");
    setPublished(true);
    setTimeout(() => navigate("/lotteries"), 1800);
  };

  if (published) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              marginBottom: 16,
              animation: "pulse 1s ease",
            }}
          >
            🎉
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            {form.status === "active"
              ? "Lottery Published!"
              : "Saved as Draft!"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Redirecting to lottery list...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <button
        className="btn btn-ghost btn-sm mb-4"
        onClick={() => navigate("/lotteries")}
      >
        <ArrowLeft size={14} /> Back to Lotteries
      </button>

      <div className="mb-6">
        <div className="section-title">Create New Lottery</div>
        <div className="section-sub">
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper mb-6">
        {STEPS.map((s, i) => (
          <>
            <div
              key={s}
              className={`step ${i === step ? "active" : i < step ? "done" : ""}`}
            >
              <div className="step-num">
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span
                style={{ display: window.innerWidth > 600 ? "block" : "none" }}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${i < step ? "done" : ""}`} />
            )}
          </>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ padding: 28 }}>
        {step === 0 && <StepBasicInfo form={form} update={update} />}
        {step === 1 && <StepPricing form={form} update={update} />}
        {step === 2 && <StepSchedule form={form} update={update} />}
        {step === 3 && (
          <StepPublish
            form={form}
            onDraft={() => handlePublish(true)}
            onPublish={() => handlePublish(false)}
          />
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between" style={{ marginTop: 32 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
          >
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function StepBasicInfo({
  form,
  update,
}: {
  form: LotteryForm;
  update: <K extends keyof LotteryForm>(k: K, v: LotteryForm[K]) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "rgba(124,58,237,.15)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tag size={18} style={{ color: "var(--accent-light)" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Basic Information</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Give your lottery a name and compelling description
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Lottery Title *</label>
        <input
          className="form-input"
          placeholder="e.g. iPhone 15 Pro Max Giveaway"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Describe the lottery, prize details, rules..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}

function StepPricing({
  form,
  update,
}: {
  form: LotteryForm;
  update: <K extends keyof LotteryForm>(k: K, v: LotteryForm[K]) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "rgba(16,185,129,.15)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DollarSign size={18} style={{ color: "var(--green)" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Ticket Pricing</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Set the cost per lottery ticket in CDF
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ticket Price (CDF)</label>
        <div style={{ position: "relative" }}>
          <input
            className="form-input"
            type="number"
            placeholder="2500"
            value={form.ticketPrice}
            onChange={(e) => update("ticketPrice", Number(e.target.value) || 0)}
            style={{ paddingLeft: 56 }}
          />
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            CDF
          </span>
        </div>
      </div>
    </div>
  );
}

function StepSchedule({
  form,
  update,
}: {
  form: LotteryForm;
  update: <K extends keyof LotteryForm>(k: K, v: LotteryForm[K]) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "rgba(59,130,246,.15)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Calendar size={18} style={{ color: "var(--blue)" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Lottery Schedule</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Define the participation window
          </div>
        </div>
      </div>

      <div className="form-grid">
        {!form.publishInstantly && (
          <div className="form-group">
            <label className="form-label">Start Date *</label>
            <input
              className="form-input"
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>
        )}
        <div
          className="form-group"
          style={{ gridColumn: form.publishInstantly ? "span 2" : "auto" }}
        >
          <label className="form-label">End Date (Deadline) *</label>
          <input
            className="form-input"
            type="date"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function StepPublish({
  form,
  onDraft,
  onPublish,
}: {
  form: LotteryForm;
  onDraft: () => void;
  onPublish: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
          Ready to Launch?
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Review your lottery before publishing
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-elevated)",
          borderRadius: 12,
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[
          { label: "Title", value: form.title || "(not set)" },
          {
            label: "Ticket Price",
            value: `${form.ticketPrice.toLocaleString()} CDF`,
          },
          {
            label: "Start Time",
            value: form.publishInstantly
              ? "Instantly after publish"
              : form.startDate || "(not set)",
          },
          { label: "End Date", value: form.endDate || "(not set)" },
        ].map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="btn btn-ghost btn-lg"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={onDraft}
        >
          <Save size={15} /> Save as Draft
        </button>
        <button
          className="btn btn-primary btn-lg"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={onPublish}
        >
          <Send size={15} /> Publish Lottery
        </button>
      </div>
    </div>
  );
}
