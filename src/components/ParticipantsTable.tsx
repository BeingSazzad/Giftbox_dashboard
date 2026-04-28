import { Eye, Trash2 } from "lucide-react";
import { Participant } from "../types/lottery";
import PaginationControls from "./PaginationControls";
import { PaginationState } from "../types/lottery";

interface ParticipantsTableProps {
  participants: Participant[];
  pagination: PaginationState;
  onViewProof: (p: Participant) => void;
  onReject: (id: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onGoToPage: (page: string) => void;
  onGoToPageChange: (value: string) => void;
}

export default function ParticipantsTable({
  participants,
  pagination,
  onViewProof,
  onReject,
  onPageChange,
  onPageSizeChange,
  onGoToPage,
  onGoToPageChange,
}: ParticipantsTableProps) {
  const pageSize = pagination.pageSize;
  const currentPage = pagination.currentPage;

  const totalPages = Math.ceil(participants.length / pageSize);
  const paginatedList = participants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Total Paid</th>
            <th>Proof</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedList.map((p) => (
            <tr key={p.id}>
              <td className="td-primary">{p.name}</td>
              <td>{p.phone}</td>
              <td>{p.city}</td>
              <td style={{ fontWeight: 600 }}>{p.tickets} tickets</td>
              <td>
                {p.proof ? (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onViewProof(p)}
                    style={{ color: "var(--primary)" }}
                  >
                    <Eye size={12} /> View
                  </button>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    —
                  </span>
                )}
              </td>
              <td>
                <span
                  className={`badge badge-${p.status}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {p.status}
                </span>
              </td>
              <td>
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
