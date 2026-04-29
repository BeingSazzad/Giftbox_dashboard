import { Lottery } from "../types/lottery";
import { Trophy } from "lucide-react";

interface LotteryDetailHeroProps {
  lottery: Lottery;
}

export default function LotteryDetailHero({ lottery }: LotteryDetailHeroProps) {
  const displayId = String(lottery?.id ?? lottery?._id ?? "");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`badge badge-${lottery.status}`}>
          {lottery.status}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          ID #{displayId}
        </span>
      </div>

      {/* Prize Image Thumbnail */}
      <div style={{ marginBottom: 20 }}>
        {lottery.prize?.image ? (
          <img
            src={lottery.prize.image}
            alt={lottery.title}
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              objectFit: "cover",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "var(--shadow-card)",
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              background: "rgba(245,158,11,.15)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gold)",
              border: "1px solid rgba(245,158,11,.25)",
            }}
          >
            <Trophy size={48} />
          </div>
        )}
      </div>

      {/* Text and Title */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px 0" }}>
          {lottery.title}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginBottom: 20,
            maxWidth: 500,
            lineHeight: 1.5,
          }}
        >
          {lottery.description}
        </p>
      </div>
    </div>
  );
}
