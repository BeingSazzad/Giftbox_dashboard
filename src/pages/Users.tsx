import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Users as UsersIcon,
  UserCheck,
  UserMinus,
  Eye,
  UserX,
} from "lucide-react";
import { useGetAllUsersQuery } from "../store/services/user.api";
import { getImageUrl } from "../shared/getImageUrl";
import Pagination from "../shared/Pagination";
import useDebounce from "../hook/useDebounce";

export default function Users() {
  const navigate = useNavigate();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pageSize] = useState(10);

  // debounce hook
  const debouncedSearch = useDebounce(search, 500);

  // Fetch users with filters & pagination
  const { data: allUsers, isLoading: isAllUsersLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: debouncedSearch,
    status: statusFilter,
    city: cityFilter,
  });

  const users = allUsers?.data || [];
  const stats = allUsers?.stats || {};
  const meta = allUsers?.meta;
  const fallbackTotalPages = Math.ceil((meta?.total || 0) / pageSize);
  const totalPages =
    meta?.totalPages || meta?.totalPage || fallbackTotalPages || 1;
  const paginationPage = meta?.page ?? currentPage;

  // For city dropdown (only from current page data - or you can fetch all cities separately)
  const cities = useMemo(() => {
    const cityList = users.map((u: any) => u.city).filter(Boolean);
    return ["All", ...new Set(cityList)];
  }, [users]);

  if (isAllUsersLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">User Management</div>
          <div className="section-sub">
            {stats.totalUsers || 0} registered users
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="metric-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 24 }}
      >
        {[
          {
            label: "Total Users",
            value: stats.totalUsers || 0,
            color: "accent",
            icon: UsersIcon,
          },
          {
            label: "Active",
            value: stats.activeUsers || 0,
            color: "green",
            icon: UserCheck,
          },
          {
            label: "Suspended",
            value: stats.inactiveUsers || 0,
            color: "red",
            icon: UserMinus,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`metric-card ${s.color}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: "20px 16px",
            }}
          >
            <div
              className={`metric-icon ${s.color}`}
              style={{ width: 48, height: 48, flexShrink: 0 }}
            >
              <s.icon size={22} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                className="metric-label"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "2px",
                }}
              >
                {s.label}
              </div>
              <div
                className="metric-value"
                style={{
                  fontSize: "26px",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-3 mb-5"
        style={{ flexWrap: "wrap" }}
      >
        <div className="search-box" style={{ width: 280 }}>
          <Search size={14} className="search-icon" />
          <input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        <select
          className="form-select"
          style={{ width: "auto", padding: "8px 14px" }}
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {cities.map((c: any) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="tabs">
          {["All", "ACTIVE", "INACTIVE"].map((s) => (
            <button
              key={s}
              className={`tab-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
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
            {users.map((user: any, index: number) => (
              <tr key={user._id}>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  {(meta.page - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        getImageUrl(user.profileImage) || "/default-avatar.png"
                      }
                      alt={user.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid var(--border)",
                      }}
                    />
                    <span className="td-primary">{user.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {user.phone || user.email || "—"}
                </td>
                <td>{user.city || "—"}</td>
                <td style={{ color: "var(--accent-light)", fontWeight: 700 }}>
                  {user.stats?.totalParticipated || 0}
                </td>
                <td>
                  {user.stats?.totalWins > 0 ? (
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                      🏆 {user.stats.totalWins}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "ACTIVE"
                        ? "badge-active"
                        : "badge-rejected"
                    }`}
                  >
                    {user.status.toLowerCase()}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/users/${user._id}`)}
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title={user.status === "ACTIVE" ? "Suspend" : "Unsuspend"}
                    >
                      <UserX size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/*  Pagination */}

        <Pagination
          currentPage={paginationPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <div className="empty-title">No users found</div>
          </div>
        )}
      </div>
    </div>
  );
}
