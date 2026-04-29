import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Gift, Users, Clock, Award, Eye } from "lucide-react";
import { useGetAllLotteryQuery } from "../store/services/lottery.api";
import { getImageUrl } from "../shared/getImageUrl";

type LotteryItem = {
  _id: string;
  title: string;
  description?: string;
  banner?: string;
  status: string;
  createdAt: string;
  startAt: string;
  endAt: string;
  ticketNumber: number;
  ticketPrice: number;
  currency: string;
};

const FILTERS = ["All", "active", "scheduled", "closed", "draft"];

export default function LotteryList() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("active");
  const [activeTab, setActiveTab] = useState(
    new URLSearchParams(window.location.search).get("tab") === "history"
      ? "history"
      : "management",
  );
  const [search, setSearch] = useState("");

  // ✅ API CALL
  const { data: allLotteries, isLoading } = useGetAllLotteryQuery({});

  const lotteries = (allLotteries?.data?.data || []) as LotteryItem[];

  // ✅ FILTER + SEARCH
  const filtered = lotteries
    .filter((l: LotteryItem) => {
      const statusMap = {
        active: "ACTIVE",
        scheduled: "SCHEDULE",
        closed: "DRAWN",
        draft: "DRAFT",
      };
      const statusKey = filter.toLowerCase() as keyof typeof statusMap;

      const matchStatus =
        filter === "All" || l.status === statusMap[statusKey];

      const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    })
    .sort(
      (a: LotteryItem, b: LotteryItem) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      {/* HEADER */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Lottery Dashboard</div>
          <div className="section-sub">
            Manage active lotteries and view past draw results
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/lotteries/create")}
        >
          <Plus size={15} /> Create Lottery
        </button>
      </div>

      {/* TABS */}
      <div
        className="tabs mb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          className={`tab-btn ${activeTab === "management" ? "active" : ""}`}
          onClick={() => setActiveTab("management")}
        >
          Lottery Management
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Draw History
        </button>
      </div>

      {activeTab === "management" ? (
        <>
          {/* FILTERS */}
          <div
            className="flex items-center gap-3 mb-6"
            style={{ flexWrap: "wrap" }}
          >
            <div className="search-box" style={{ width: 260 }}>
              <Search size={14} className="search-icon" />
              <input
                placeholder="Search lotteries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="tabs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`tab-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "closed"
                    ? "Ready to Draw"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Gift size={48} style={{ opacity: 0.2 }} />
              </div>
              <div className="empty-title">No lotteries found</div>
              <div className="empty-text">
                Try adjusting your filter or create a new lottery.
              </div>
            </div>
          ) : (
            <div className="lottery-grid">
              {filtered.map((l: LotteryItem) => (
                <LotteryCard
                  key={l._id}
                  lottery={l}
                    onView={() => navigate(`/lotteries/${l._id}`, { state: { lottery: l } })}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        // HISTORY TAB (minimal, same design)
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lottery</th>
                <th>Status</th>
                <th>Price</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lotteries
                .filter((l: LotteryItem) => l.status === "DRAWN")
                .map((l: LotteryItem) => (
                  <tr key={l._id}>
                    <td>{l.title}</td>
                    <td>{l.status}</td>
                    <td>
                      {l.ticketPrice} {l.currency}
                    </td>
                    <td>{new Date(l.endAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/lotteries/${l._id}`, { state: { lottery: l } })}
                      >
                        <Eye size={12} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LotteryCard({ lottery: l, onView }: { lottery: LotteryItem; onView: () => void }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(l.endAt).getTime() - Date.now()) / 86400000),
  );

  return (
    <div className="lottery-card component-card">
      <div className="lottery-banner">
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, var(--bg-elevated), rgba(124,58,237,.3))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.8,
          }}
        >
          {l?.banner ? (
            <img src={getImageUrl(l?.banner)} alt={l.title} />
          ) : (
            <Gift size={64} strokeWidth={1} />
          )}
        </div>

        <div className="lottery-banner-overlay" />

        <div className="lottery-banner-badge">
          <span className={`badge badge-${l.status?.toLowerCase()}`}>
            {l.status}
          </span>
        </div>

        <div className="lottery-countdown-badge">
          {l.status === "DRAWN" ? "✓ Ended" : `${daysLeft}d left`}
        </div>
      </div>

      <div className="lottery-body">
        <div className="lottery-title">{l.title}</div>

        <div className="lottery-meta">
          <div className="lottery-stat">
            <Users size={12} /> <strong>{l.ticketNumber}</strong>
          </div>
          <div className="lottery-stat">
            <Clock size={12} /> {new Date(l.startAt).toLocaleDateString()}
          </div>
        </div>

        <div style={{ fontSize: 12, marginBottom: 10 }}>{l.description}</div>

        <div style={{ fontSize: 12 }}>
          Price:{" "}
          <strong>
            {l.ticketPrice} {l.currency}
          </strong>
        </div>

        <div className="lottery-actions" style={{ marginTop: 10 }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: "100%" }}
            onClick={onView}
          >
            View Lottery
          </button>
        </div>
      </div>
    </div>
  );
}
