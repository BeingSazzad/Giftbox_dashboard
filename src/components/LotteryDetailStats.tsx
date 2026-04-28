import { Trophy, Users, Tag, TrendingUp } from "lucide-react";
import { Lottery } from "../types/lottery";

interface LotteryDetailStatsProps {
  lottery: Lottery;
  participantCount: number;
  ticketPrice: number;
  revenue: number;
}

export default function LotteryDetailStats({
  lottery,
  participantCount,
  ticketPrice,
  revenue,
}: LotteryDetailStatsProps) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[
        {
          label: "Participants",
          value: participantCount,
          icon: Users,
        },
        {
          label: "Ticket Price",
          value: `${ticketPrice.toLocaleString()} CDF`,
          icon: Tag,
        },
        {
          label: "Revenue",
          value: `${revenue.toLocaleString()} CDF`,
          icon: TrendingUp,
        },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "12px 16px",
            minWidth: 120,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <s.icon size={14} style={{ color: "var(--text-muted)" }} />
            {s.label}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "var(--text-primary)",
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
