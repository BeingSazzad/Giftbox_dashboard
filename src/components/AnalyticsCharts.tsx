import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  useGetAnalyticsTicketsQuery,
  useGetMonthlyIncomeCDFQuery,
} from "../store/services/dashboard.api";
import { useState } from "react";
import Loading from "../shared/Loading";

export const AnalyticsCharts = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  const [year, setYear] = useState<number>(currentYear);

  const selectedYear = Number.isFinite(year) ? year : currentYear;
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetAnalyticsTicketsQuery(selectedYear);
  const { data: monthlyIncomeData, isLoading: isMonthlyIncomeLoading } =
    useGetMonthlyIncomeCDFQuery(selectedYear);

  if (isAnalyticsLoading || isMonthlyIncomeLoading) {
    return <Loading />;
  }
  const analyticsData =
    analytics?.data?.data?.map((item: any) => ({
      name: item.month,
      users: item.totalUsers,
      tickets: item.totalTickets,
    })) || [];
  const monthlyIncome =
    monthlyIncomeData?.data?.data?.map((item: any) => ({
      name: item.month,
      revenue: item.totalRevenue,
    })) || [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 28,
      }}
    >
      {/* User Growth vs Tickets Sold */}
      <div className="card" style={{ padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Users vs Tickets Sold
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Conversion overview
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setYear(Number(e.target.value))}
            className="form-select"
            style={{
              width: 85,
              padding: "4px 10px",
              fontSize: 12,
              height: 28,
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analyticsData || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--green)"
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                tickFormatter={(val) => (val >= 1000 ? val / 1000 + "k" : val)}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "var(--shadow-card)",
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              />
              <Area
                type="monotone"
                name="Total Users"
                dataKey="users"
                stroke="var(--green)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Area
                type="monotone"
                name="Tickets Sold"
                dataKey="tickets"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTickets)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="card" style={{ padding: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Monthly Income (CDF)
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Revenue trajectory
            </div>
          </div>
          <select
            className="form-select"
            style={{
              width: 85,
              padding: "4px 10px",
              fontSize: 12,
              height: 28,
            }}
          >
            {["2026", "2025", "2024"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyIncome || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                tickFormatter={(val) => (val >= 1000 ? val / 1000 + "M" : val)}
              />
              <RechartsTooltip
                cursor={{ fill: "var(--bg-hover)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "var(--shadow-card)",
                }}
              />
              <Bar dataKey="revenue" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
