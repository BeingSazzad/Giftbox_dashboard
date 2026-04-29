import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Edit,
  Pause,
  HelpCircle,
  FileText,
} from "lucide-react";
import { mockLotteries, mockParticipants } from "../data/mockData";
import { Lottery, Participant, PaginationState } from "../types/lottery";
import LotteryDetailHero from "../components/LotteryDetailHero";
import LotteryDetailStats from "../components/LotteryDetailStats";
import CountdownBox from "../components/CountdownBox";
import ViewProofModal from "../components/ViewProofModal";
import RejectModal from "../components/RejectModal";
import ParticipantsTable from "../components/ParticipantsTable";
import ProofsTable from "../components/ProofsTable";

// ================== COUNTDOWN HOOK ==================
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

// ================== MAIN COMPONENT ==================
export default function LotteryDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ---- LOTTERY RESOLUTION ----
  const resolvedLottery =
    location.state?.lottery ??
    (mockLotteries as Lottery[]).find(
      (l) => String(l.id) === String(id) || String(l._id) === String(id),
    );
  const lotteryKey = String(resolvedLottery?.id ?? resolvedLottery?._id ?? id ?? "");

  // ---- STATE MANAGEMENT ----
  const [lottery, setLottery] = useState<Lottery | undefined>(resolvedLottery);
  const [tab, setTab] = useState("participants");
  const [participants, setParticipants] = useState<Participant[]>(
    mockParticipants.filter((p) => p.lotteryId === lotteryKey) as Participant[],
  );
  const [viewProof, setViewProof] = useState<Participant | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    goToPage: "",
  });

  // ---- CALCULATIONS ----
  const { d, h, m, s } = useCountdown(lottery?.endDate || lottery?.endAt || "");
  const participantCount = lottery?.participants ?? participants.length;
  const ticketPrice = lottery?.ticketPrice ?? 0;
  const revenue = lottery?.revenue ?? 0;

  const filteredParticipants =
    tab === "participants"
      ? participants
      : participants.filter((p) => p.status === "pending");

  const statCounts = {
    all: participants.length,
    approved: participants.filter((p) => p.status === "approved").length,
    pending: participants.filter((p) => p.status === "pending").length,
    rejected: participants.filter((p) => p.status === "rejected").length,
  };

  // ---- ACTIONS ----
  const approveP = (pid: string) => {
    setParticipants((ps) =>
      ps.map((p) => (p.id === pid ? { ...p, status: "approved" } : p)),
    );
  };

  const rejectP = (pid: string) => {
    setParticipants((ps) =>
      ps.map((p) => (p.id === pid ? { ...p, status: "rejected" } : p)),
    );
    setRejectModal(null);
    setRejectReason("");
  };

  const endLottery = () => {
    if (window.confirm("Are you sure you want to end this lottery immediately?")) {
      setLottery((current) =>
        current ? { ...current, status: "drawing" } : current,
      );
    }
  };

  // ---- PAGINATION HANDLERS ----
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  const handleGoToPageChange = (value: string) => {
    setPagination((prev) => ({ ...prev, goToPage: value }));
  };

  const handleGoToPage = (page: string) => {
    const pageNum = parseInt(page);
    const totalPages = Math.ceil(
      filteredParticipants.length / pagination.pageSize,
    );
    if (pageNum > 0 && pageNum <= totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: pageNum,
        goToPage: "",
      }));
    }
  };

  // ---- RENDER ----
  if (!lottery)
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <HelpCircle size={48} style={{ opacity: 0.2 }} />
        </div>
        <div className="empty-title">Lottery not found</div>
        <button
          className="btn btn-primary"
          style={{ margin: "14px auto 0", display: "flex" }}
          onClick={() => navigate("/lotteries")}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    );

  return (
    <div>
      {/* BACK BUTTON */}
      <button
        className="btn btn-ghost btn-sm mb-4"
        onClick={() => navigate("/lotteries")}
      >
        <ArrowLeft size={14} /> All Lotteries
      </button>

      {/* HERO SECTION */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--bg-elevated), rgba(124,58,237,.12))",
          border: "1px solid var(--border-bright)",
          borderRadius: "var(--radius-xl)",
          padding: "28px",
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* LEFT: Hero + Stats */}
        <div>
          <LotteryDetailHero lottery={lottery} />
          <div style={{ marginTop: 20 }}>
            <LotteryDetailStats
              lottery={lottery}
              participantCount={participantCount}
              ticketPrice={ticketPrice}
              revenue={revenue}
            />
          </div>
        </div>

        {/* RIGHT: Actions + Countdown */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-end",
            minWidth: 260,
          }}
        >
          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {lottery.status !== "completed" && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/lotteries/create")}
              >
                <Edit size={13} /> Edit
              </button>
            )}
            {lottery.status === "active" && (
              <button className="btn btn-outline btn-sm">
                <Pause size={13} /> Pause
              </button>
            )}
          </div>

          {/* Countdown */}
          {lottery.status === "active" && (
            <CountdownBox d={d} h={h} m={m} s={s} />
          )}

          {/* Primary Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            {lottery.status === "active" && (
              <button
                className="btn btn-danger"
                style={{
                  justifyContent: "center",
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                }}
                onClick={endLottery}
              >
                <XCircle size={16} /> End Lottery Now
              </button>
            )}
            {(lottery.status === "drawing" || lottery.status === "closed") && (
              <button
                className="btn btn-gold"
                style={{
                  justifyContent: "center",
                  width: "100%",
                  height: 48,
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 14,
                  boxShadow: "0 4px 15px rgba(217,119,6,0.3)",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                }}
                onClick={() => navigate(`/lotteries/${id}/winner`)}
              >
                <Trophy size={18} /> Draw Winner(s)
              </button>
            )}
          </div>

          {/* Winners Section */}
          {lottery.status === "completed" &&
            lottery.winners &&
            lottery.winners.length > 0 && (
              <div
                style={{
                  background: "rgba(245,158,11,.05)",
                  border: "1px solid rgba(245,158,11,.2)",
                  borderRadius: 16,
                  padding: "16px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--gold)",
                    fontWeight: 800,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 12,
                  }}
                >
                  <Trophy size={14} /> {lottery.winners.length}{" "}
                  {lottery.winners.length > 1 ? "Winners" : "Winner"} Drawn
                </div>
                <button
                  className="btn btn-sm"
                  style={{
                    width: "100%",
                    height: 44,
                    fontSize: 13,
                    fontWeight: 800,
                    background: "rgba(245,158,11,.15)",
                    color: "var(--gold)",
                    border: "1.5px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    borderRadius: 14,
                    transition: "var(--transition)",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.1)",
                  }}
                  onClick={() => navigate(`/lotteries/${id}/winner`)}
                >
                  <RotateCcw size={16} strokeWidth={2.5} /> RE-DRAW / CHANGE
                </button>
              </div>
            )}
        </div>
      </div>

      {/* TABS & TABLES */}
      {lottery.status !== "scheduled" && lottery.status !== "draft" && (
        <>
          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-3 mb-5">
            <div className="tabs">
              {["participants", "proofs"].map((t) => (
                <button
                  key={t}
                  className={`tab-btn ${tab === t ? "active" : ""}`}
                  onClick={() => {
                    setTab(t);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }}
                  style={{ textTransform: "capitalize" }}
                >
                  {t === "proofs" ? "Review Proofs" : t}
                  {t === "proofs" && statCounts.pending > 0 && (
                    <span
                      style={{
                        marginLeft: 6,
                        background: "var(--gold)",
                        color: "#1a1000",
                        borderRadius: 10,
                        padding: "0 6px",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {statCounts.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: 12,
                alignItems: "center",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              <span
                style={{
                  color: "var(--green)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <CheckCircle size={13} /> {statCounts.approved} approved
              </span>
              <span
                style={{
                  color: "var(--gold)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Clock size={13} /> {statCounts.pending} pending
              </span>
              <span
                style={{
                  color: "var(--red)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <XCircle size={13} /> {statCounts.rejected} rejected
              </span>
            </div>
          </div>

          {/* PARTICIPANTS TABLE */}
          {tab === "participants" && (
            <ParticipantsTable
              participants={participants}
              pagination={pagination}
              onViewProof={setViewProof}
              onReject={(id) => setRejectModal(id)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onGoToPage={handleGoToPage}
              onGoToPageChange={handleGoToPageChange}
            />
          )}

          {/* PROOFS TABLE */}
          {tab === "proofs" && (
            <ProofsTable
              proofs={participants.filter((p) => p.status === "pending")}
              pagination={pagination}
              onViewProof={setViewProof}
              onApprove={approveP}
              onReject={(id) => setRejectModal(id)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onGoToPage={handleGoToPage}
              onGoToPageChange={handleGoToPageChange}
            />
          )}

          {/* EMPTY STATE FOR PROOFS */}
          {tab === "proofs" &&
            participants.filter((p) => p.status === "pending").length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FileText size={48} style={{ opacity: 0.2 }} />
                </div>
                <div className="empty-title">No pending proofs</div>
                <div className="empty-text">
                  All payment proofs have been reviewed.
                </div>
              </div>
            )}
        </>
      )}

      {/* MODALS */}
      <ViewProofModal
        participant={viewProof}
        onClose={() => setViewProof(null)}
        onApprove={(id) => {
          approveP(id);
          setViewProof(null);
        }}
      />

      <RejectModal
        isOpen={rejectModal !== null}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={() => {
          setRejectModal(null);
          setRejectReason("");
        }}
        onConfirm={() => {
          if (rejectModal) {
            rejectP(rejectModal);
          }
        }}
      />
    </div>
  );
}
