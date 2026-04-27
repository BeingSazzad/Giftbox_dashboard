import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gift,
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  Plus,
  Eye,
  Search,
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart2,
  ArrowRight,
  Trophy,
  Tag,
  CheckSquare,
  CreditCard,
  Wallet,
  Award,
} from "lucide-react";
import { mockLotteries, mockParticipants, mockUsers } from "../data/mockData";
import { useGetUserQuery } from "../store/services/user.api";
import { useGetDashboardDataQuery } from "../store/services/dashboard.api";
import { AnalyticsCharts } from "../components/AnalyticsCharts";

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return time;
}

function CountdownWidget({ date }: { date: string }) {
  const { d, h, m, s } = useCountdown(date);

  return (
    <div className="countdown" style={{ display: "flex", gap: "16px" }}>
      {[
        { label: "d", value: d },
        { label: "h", value: h },
        { label: "m", value: m },
        { label: "s", value: s },
      ].map(({ label, value }, i) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div className="countdown-seg">
            <div className="countdown-num">
              {String(value).padStart(2, "0")}
            </div>
            <div className="countdown-label">{label}</div>
          </div>
          {i < 3 && <span className="countdown-sep">:</span>}
        </div>
      ))}
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    label: "New Lottery",
    icon: Plus,
    color: "accent",
    path: "/lotteries/create",
  },
  {
    label: "Verifications",
    icon: CheckCircle,
    color: "gold",
    path: "/lotteries",
  },
  { label: "Active Lotteries", icon: Gift, color: "green", path: "/lotteries" },
  { label: "User Search", icon: Search, color: "blue", path: "/users" },
  { label: "Support Inbox", icon: AlertCircle, color: "red", path: "/support" },
  {
    label: "Revenue Report",
    icon: BarChart2,
    color: "pink",
    path: "/settings",
  },
];

const colorToRgb = (c: string): string => {
  const map: Record<string, string> = {
    accent: "124,58,237",
    gold: "245,158,11",
    green: "16,185,129",
    blue: "59,130,246",
    red: "239,68,68",
    pink: "236,72,153",
  };
  return map[c] || "124,58,237";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserQuery({});
  const { data: dashboardData, isLoading: isDashboardDataLoading } =
    useGetDashboardDataQuery({});

  const completedDraws = mockLotteries.filter(
    (l) => l.status === "completed",
  ).length;
  const pendingPayments = mockParticipants.filter(
    (p) => p.status === "pending",
  ).length;
  const ticketsSold = mockParticipants.reduce((s, p) => s + p.tickets, 0);
  const totalRevenue = mockLotteries.reduce((s, l) => s + l.revenue, 0);

  const nextLottery = mockLotteries.find((l) => l.status === "active");

  if (isLoading || isDashboardDataLoading) {
    return <div className="loading">Loading...</div>;
  }

  const userData = user?.data;
  const dashboardStats = dashboardData?.data?.stats || {};
  const metrics = [
    {
      label: "Total Users",
      value: dashboardStats.totalUsers,
      icon: Users,
      color: "blue",

      dir: "up" as const,
    },
    {
      label: "Draws Completed",
      value: dashboardStats.totalDrawCompleted,
      icon: CheckSquare,
      color: "accent",

      dir: "up" as const,
    },
    {
      label: "Tickets Sold",
      value: dashboardStats.totalTicketsSold,
      icon: Tag,
      color: "green",

      dir: "up" as const,
    },
    {
      label: "Total Revenue",
      value: `$${dashboardStats.totalRevenue} CDF`,
      icon: Wallet,
      color: "pink",

      dir: "up" as const,
    },
  ];
  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 28px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 24 }}>👋</span>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>
              Good afternoon, {userData.name}
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            You have{" "}
            <strong style={{ color: "var(--gold)" }}>
              3 pending payment verifications
            </strong>{" "}
            and the{" "}
            <strong style={{ color: "var(--accent-light)" }}>
              Weekly Draw
            </strong>{" "}
            is running right now.
          </p>
        </div>

        {nextLottery && (
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              NEXT DEADLINE — {nextLottery.title}
            </div>
            <CountdownWidget date={nextLottery.endDate} />
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="metric-grid">
        {metrics.map((m) => (
          <div key={m.label} className={`metric-card ${m.color}`}>
            <div className="flex items-center justify-between">
              <div className={`metric-icon ${m.color}`}>
                <m.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div
                className="metric-label"
                style={{
                  fontSize: "14px",
                  textTransform: "none",
                  letterSpacing: 0,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                {m.label}
              </div>
              <div
                className="metric-value"
                style={{
                  fontSize: "24px",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {m.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />
      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-header">
          <div>
            <div className="section-title">Quick Actions</div>
            <div className="section-sub">Common admin operations</div>
          </div>
          <Zap size={16} style={{ color: "var(--gold)" }} />
        </div>
        <div className="quick-grid">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.label}
              className="quick-card"
              onClick={() => navigate(a.path)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`quick-card-icon ${a.color}`}
                style={{
                  background: `rgba(${colorToRgb(a.color)}, 0.15)`,
                  color: `var(--${a.color === "accent" ? "accent-light" : a.color})`,
                }}
              >
                <a.icon size={20} />
              </div>
              <span className="quick-card-label">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
