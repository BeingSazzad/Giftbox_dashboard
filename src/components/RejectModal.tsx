import { X } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RejectModal({
  isOpen,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}: RejectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Reject Payment</span>
          <button className="modal-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group mb-4">
            <label className="form-label">Reason for Rejection</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Blurry image, incorrect amount, wrong reference..."
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
          </div>
          <label
            className="remember-check"
            style={{
              padding: "12px 16px",
              background: "rgba(239,68,68,.05)",
              border: "1px solid rgba(239,68,68,.2)",
              borderRadius: 8,
              color: "var(--red)",
              fontWeight: 600,
              alignItems: "flex-start",
              display: "flex",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              style={{ marginTop: 2, accentColor: "var(--red)" }}
            />
            <span>
              I confirm this payment proof is invalid and should be rejected.
            </span>
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
