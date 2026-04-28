import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationState } from "../types/lottery";

interface PaginationControlsProps {
  pagination: PaginationState;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onGoToPage: (page: string) => void;
  onGoToPageChange: (value: string) => void;
}

export default function PaginationControls({
  pagination,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onGoToPage,
  onGoToPageChange,
}: PaginationControlsProps) {
  const { currentPage, pageSize, goToPage } = pagination;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        padding: "24px 16px",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Left: Items per page */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "2px 8px",
            color: "var(--text-primary)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {[10, 20, 50, 100].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              width: 32,
              height: 32,
              padding: 0,
              borderRadius: 8,
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {totalPages <= 7 ? (
            [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-ghost"}`}
                onClick={() => onPageChange(i + 1)}
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </button>
            ))
          ) : (
            <>
              {[1, 2].map((p) => (
                <button
                  key={p}
                  className={`btn btn-sm ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => onPageChange(p)}
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {p}
                </button>
              ))}
              {currentPage > 4 && <span style={{ padding: "0 4px" }}>...</span>}
              {currentPage > 3 && currentPage < totalPages - 2 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onPageChange(currentPage)}
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {currentPage}
                </button>
              )}
              {currentPage < totalPages - 3 && <span style={{ padding: "0 4px" }}>...</span>}
              {[totalPages - 1, totalPages].map((p) => (
                p > 0 && (
                  <button
                    key={p}
                    className={`btn btn-sm ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => onPageChange(p)}
                    style={{
                      width: 32,
                      height: 32,
                      padding: 0,
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {p}
                  </button>
                )
              ))}
            </>
          )}

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              width: 32,
              height: 32,
              padding: 0,
              borderRadius: 8,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Go to page */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <span>Go to</span>
          <input
            type="text"
            value={goToPage}
            onChange={(e) => onGoToPageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt(goToPage);
                if (page > 0 && page <= totalPages) {
                  onGoToPage(String(page));
                }
              }
            }}
            style={{
              width: 44,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "2px 8px",
              textAlign: "center",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
