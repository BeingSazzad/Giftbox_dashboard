import { X } from "lucide-react";
import { Participant } from "../types/lottery";

interface ViewProofModalProps {
  participant: Participant | null;
  onClose: () => void;
  onApprove: (id: string) => void;
}

export default function ViewProofModal({
  participant,
  onClose,
  onApprove,
}: ViewProofModalProps) {
  if (!participant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">Customer Name: {participant.name}</span>
          <button className="modal-close" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800"
            alt="Payment Proof"
            style={{
              width: "100%",
              borderRadius: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          />
          <div
            style={{
              marginTop: 20,
              padding: 18,
              background: "var(--bg-elevated)",
              borderRadius: 12,
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Phone
                </div>
                <div style={{ fontWeight: 600 }}>{participant.phone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Tickets
                </div>
                <div style={{ fontWeight: 600 }}>{participant.tickets}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          {participant.status === "pending" && (
            <button
              className="btn btn-primary"
              onClick={() => onApprove(participant.id)}
            >
              Approve Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
