interface CountdownBoxProps {
  d: number;
  h: number;
  m: number;
  s: number;
}

export default function CountdownBox({ d, h, m, s }: CountdownBoxProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        padding: "24px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        width: "100%",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          textAlign: "center",
          marginBottom: 16,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        CLOSES IN
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="countdown">
          {[
            ["d", d],
            ["h", h],
            ["m", m],
            ["s", s],
          ].map(([lbl, val], i) => (
            <div
              key={lbl}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div className="countdown-seg">
                <div className="countdown-num">
                  {String(val).padStart(2, "0")}
                </div>
                <div className="countdown-label">{lbl}</div>
              </div>
              {i < 3 && <div className="countdown-sep">:</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
