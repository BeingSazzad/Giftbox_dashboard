import { useState } from "react";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Phone,
  Globe,
  CreditCard,
  Save,
  CheckCircle,
  Users,
} from "lucide-react";
import { mockLotteries } from "../data/mockData";
import { useGetAnalyticsPaymentQuery } from "../store/services/finance.api";

export default function Finance() {
  const [currency, setCurrency] = useState("CDF");
  const [paymentNums, setPaymentNums] = useState([
    "+243 810 000 001",
    "+243 820 000 002",
  ]);
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState(false);
  const { data: analytics, isLoading } = useGetAnalyticsPaymentQuery({
    filter,
  });
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const totalRevenue = mockLotteries.reduce(
    (acc, curr) => acc + curr.revenue,
    0,
  );
  const ticketsSold = mockLotteries.reduce(
    (acc, curr) => acc + curr.participants,
    0,
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const analyticsData = analytics?.data || {};

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Finance & Payments</div>
          <div className="section-sub">
            Manage revenue, currency, and mobile money gateways
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <select
            className="form-select"
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: 150 }}
          >
            <option>All Time</option>
            <option>This Month</option>
            <option>This Week</option>
            <option>This Year</option>
          </select>
          <button
            className={`btn ${saved ? "btn-success" : "btn-primary"}`}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <CheckCircle size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saved && (
        <div
          style={{
            background: "rgba(16,185,129,.1)",
            border: "1px solid rgba(16,185,129,.25)",
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 22,
            fontSize: 13,
            color: "var(--green)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle size={15} /> Financial settings saved successfully.
        </div>
      )}

      {/* Financial Overview Stats */}
      <div
        className="metric-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 30 }}
      >
        <div
          className="metric-card gold"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: "20px 16px",
          }}
        >
          <div
            className="metric-icon gold"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <Wallet size={22} strokeWidth={2.5} />
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
              Total Revenue
            </div>
            <div
              className="metric-value"
              style={{
                fontSize: "24px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {analyticsData.totalRevenue}{" "}
              <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}>
                {currency}
              </span>
            </div>
          </div>
        </div>

        <div
          className="metric-card blue"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: "20px 16px",
          }}
        >
          <div
            className="metric-icon blue"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <Users size={22} strokeWidth={2.5} />
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
              Total Participations
            </div>
            <div
              className="metric-value"
              style={{
                fontSize: "24px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {analyticsData.totalParticipations?.toLocaleString()}
            </div>
          </div>
        </div>

        <div
          className="metric-card green"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: "20px 16px",
          }}
        >
          <div
            className="metric-icon green"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <TrendingUp size={22} strokeWidth={2.5} />
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
              Avg Ticket Price
            </div>
            <div
              className="metric-value"
              style={{
                fontSize: "24px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {analyticsData?.averageTicketPrice}{" "}
              <span
                style={{ fontSize: 13, fontWeight: 500, opacity: 0.8 }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Payment Gateways Configuration */}
        <div className="settings-block" style={{ margin: 0 }}>
          <div className="settings-block-header">
            <Phone size={16} style={{ color: "var(--green)" }} />
            Payment Gateway Numbers
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 400,
              }}
            >
              Displayed to users
            </span>
          </div>
          <div
            style={{
              padding: "16px 20px 20px",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Configure the mobile money numbers that users will send their
            payments to. Ensure these numbers are active and monitored.
          </div>
          {paymentNums.map((num, i) => (
            <div key={i} className="settings-row">
              <div>
                <div className="settings-row-label">Payment Number {i + 1}</div>
                <div className="settings-row-desc">
                  {i === 0 ? "M-Pesa primary number" : "Orange Money number"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  className="form-input"
                  value={num}
                  onChange={(e) =>
                    setPaymentNums((ns) =>
                      ns.map((n, j) => (j === i ? e.target.value : n)),
                    )
                  }
                  style={{ width: 200 }}
                  placeholder="+243 XXX XXX XXX"
                />
              </div>
            </div>
          ))}
          <div className="settings-row" style={{ borderBottom: "none" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              ⚠ Changing payment numbers will update them immediately in the
              user app. Notify users before changing.
            </div>
          </div>
        </div>

        {/* Currency & Financial Preferences */}
        <div className="settings-block" style={{ margin: 0 }}>
          <div className="settings-block-header">
            <Globe size={16} style={{ color: "var(--gold)" }} />
            Currency Defaults
          </div>
          <div className="settings-row" style={{ borderBottom: "none" }}>
            <div>
              <div className="settings-row-label">Platform Currency</div>
              <div className="settings-row-desc">
                System-wide currency used for tickets and revenue calculation
              </div>
            </div>
            <select
              className="form-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: 130 }}
            >
              <option value="CDF">CDF — Congolese Franc</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
