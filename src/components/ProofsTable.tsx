import { Eye, ThumbsUp, Trash2 } from "lucide-react";
import { Participant } from "../types/lottery";
import PaginationControls from "./PaginationControls";
import { PaginationState } from "../types/lottery";

interface ProofsTableProps {
  proofs: Participant[];
  pagination: PaginationState;
  onViewProof: (p: Participant) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onGoToPage: (page: string) => void;
  onGoToPageChange: (value: string) => void;
}

export default function ProofsTable({
  proofs,
  pagination,
  onViewProof,
  onApprove,
  onReject,
  onPageChange,
  onPageSizeChange,
  onGoToPage,
  onGoToPageChange,
}: ProofsTableProps) {
  const pageSize = pagination.pageSize;
  const currentPage = pagination.currentPage;

  const totalPages = Math.ceil(proofs.length / pageSize);
  const paginatedList = proofs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: "35%" }}>Sender</th>
            <th style={{ width: "20%" }}>Tickets</th>
            <th style={{ width: "15%" }}>Proof</th>
            <th style={{ width: "15%" }}>Status</th>
            <th style={{ width: "15%", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map((p) => (
            <tr key={p.id}>
              <td className="td-primary">{p.name}</td>
              <td>{p.tickets}</td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onViewProof(p)}
                  style={{ color: "var(--primary)" }}
                >
                  <Eye size={12} /> View
                </button>
              </td>
              <td>
                <span
                  className={`badge badge-${p.status}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {p.status}
                </span>
              </td>
              <td style={{ textAlign: "right" }}>
                {p.status === "pending" && (
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onApprove(p.id)}
                      style={{ padding: "4px 12px" }}
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{
                        borderColor: "var(--red)",
                        color: "var(--red)",
                        padding: "4px 8px",
                      }}
                      onClick={() => onReject(p.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationControls
        pagination={pagination}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onGoToPage={onGoToPage}
        onGoToPageChange={onGoToPageChange}
      />
    </div>
  );
}
