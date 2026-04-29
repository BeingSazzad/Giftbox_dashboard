import { useState } from "react";
import {
  Search,
  MessageSquare,
  Clock,
  X,
  Users,
  Eye,
  Check,
  Mail,
  CircleCheck,
} from "lucide-react";

import {
  useGetAllSupportsQuery,
  useUpdateSupportStatusMutation,
} from "../store/services/supports.api";

import { getImageUrl } from "../shared/getImageUrl";
import { ISupportTicket } from "../types/support";
import { toast } from "sonner";
import useDebounce from "../hook/useDebounce";

export default function Support() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Fixed debounce
  const debouncedSearch = useDebounce(search, 500);

  const { data: supports, isLoading, refetch } = useGetAllSupportsQuery({});

  const [updateSupportStatus] = useUpdateSupportStatusMutation();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Extract data from nested response structure
  const supportData: ISupportTicket[] = supports?.data?.data || [];

  const messages = supportData.map((support: ISupportTicket) => ({
    id: support._id,
    user: support.userId?.name || support.name || "Unknown User",
    email: support.userId?.email || support.email || "",
    avatar:
      getImageUrl(support.userId?.profileImage) ||
      getImageUrl(support?.profileImage) ||
      "/default-avatar.png",
    issue: support.subject,
    preview: support.message,
    attachment: support.attachment ? getImageUrl(support.attachment) : null,
    status: support.status.toLowerCase(),
    priority: "Medium",
    time: new Date(support.updatedAt).toLocaleDateString(),
    date: new Date(support.updatedAt).toLocaleString(),
  }));

  // Filter messages
  const filtered = messages.filter((m: any) => {
    const matchSearch =
      m.user.toLowerCase().includes(search.toLowerCase()) ||
      m.issue.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" || m.status === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  const markResolved = async (id: string) => {
    await updateSupportStatus({ id, status: "RESOLVED" })
      .unwrap()
      .then(() => {
        toast.success("Ticket marked as resolved...");
        refetch();
      })
      .catch(() => {
        toast.error("Failed to update status");
      });
  };

  const handleReply = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === "High") return "var(--red)";
    if (p === "Medium") return "var(--gold)";
    return "var(--text-muted)";
  };

  const getPriorityBg = (p: string) => {
    if (p === "High") return "rgba(239,68,68,.1)";
    if (p === "Medium") return "rgba(245,158,11,.1)";
    return "var(--bg-elevated)";
  };

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Support</div>
          <div className="section-sub">
            Manage help requests and assist users with issues ({filtered.length}{" "}
            tickets)
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-4 mb-6"
        style={{ justifyContent: "space-between" }}
      >
        <div className="tabs">
          {["All", "Pending", "Resolved"].map((f) => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div
          className="search-box"
          style={{ width: 300, background: "var(--bg-card)" }}
        >
          <Search size={14} className="search-icon" />
          <input
            placeholder="Search by name, subject, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <th style={{ width: 100, textAlign: "center" }}>PRIORITY</th>
              <th style={{ width: 140, textAlign: "center" }}>STATUS</th>
              <th style={{ width: 100, textAlign: "right" }}>UPDATED</th>
              <th style={{ width: 120, textAlign: "center" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m: any) => (
              <tr key={m.id}>
                <td
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{m.id.slice(-6)}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt=""
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid var(--border)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.user}
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {m.issue}
                  </div>
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 700,
                      background: getPriorityBg(m.priority),
                      color: getPriorityColor(m.priority),
                    }}
                  >
                    {m.priority}
                  </span>
                </td>
                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <span
                    className={`badge ${
                      m.status === "resolved"
                        ? "badge-active"
                        : m.status === "pending"
                          ? "badge-pending"
                          : "badge-info"
                    }`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "currentColor",
                      }}
                    />
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </td>
                <td
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textAlign: "right",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {m.time}
                </td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedTicket(m)}
                      title="View Details"
                    >
                      <Eye size={12} />
                    </button>
                    {m.status === "resolved" ? (
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled
                        title="Reopen Ticket"
                        style={{ color: "var(--gold)" }}
                      >
                        <CircleCheck size={12} />
                        resolved
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => markResolved(m?.id)}
                        title="Mark as Resolved"
                      >
                        <Check size={12} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageSquare />
            </div>
            <div className="empty-title">No tickets found</div>
          </div>
        )}
      </div>

      {/* Ticket Modal - Kept exactly same design */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div
            className="modal"
            style={{
              maxWidth: 650,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    #{(selectedTicket as any).id.slice(-6)}
                  </span>
                  <span
                    className={`badge ${
                      (selectedTicket as any).status === "resolved"
                        ? "badge-active"
                        : (selectedTicket as any).status === "pending"
                          ? "badge-pending"
                          : "badge-info"
                    }`}
                  >
                    {(selectedTicket as any).status.charAt(0).toUpperCase() +
                      (selectedTicket as any).status.slice(1)}
                  </span>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setSelectedTicket(null)}
                >
                  <X size={16} />
                </button>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
                ISSUE
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Users size={12} /> {(selectedTicket as any).user}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={12} /> {(selectedTicket as any).date}
                </span>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "28px",
                background: "var(--bg-elevated)",
                flex: 1,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <img
                  src={(selectedTicket as any).avatar}
                  alt=""
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}
                  >
                    {(selectedTicket as any).user}
                  </div>
                  <div
                    style={{
                      background: "var(--bg-card)",
                      padding: "16px 20px",
                      borderRadius: "0 12px 12px 12px",
                      border: "1px solid var(--border)",
                      fontSize: 13,
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {(selectedTicket as any).issue}
                    {(selectedTicket as any).attachment && (
                      <div
                        style={{
                          marginTop: 16,
                          borderTop: "1px solid var(--border)",
                          paddingTop: 16,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            marginBottom: 8,
                            textTransform: "uppercase",
                          }}
                        >
                          Attachment
                        </div>
                        <img
                          src={(selectedTicket as any).attachment}
                          alt="Attachment"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 320,
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            objectFit: "contain",
                            background: "var(--bg-card)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 8,
                    }}
                  >
                    {(selectedTicket as any).date}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Reply Action */}
            <div
              style={{
                padding: "24px 28px",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-card)",
                borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  User Email:{" "}
                  <span
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    {(selectedTicket as any).email}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleReply((selectedTicket as any).email)}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Mail size={14} />
                  Reply via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
