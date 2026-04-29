export type LotteryStatus = "ACTIVE" | "SCHEDULE" | "DRAWN" | "DRAFT" | "drawing" | "closed" | "completed" | "scheduled" | "active" | "draft";

export type ParticipantStatus = "approved" | "rejected" | "pending";

export interface Prize {
  name: string;
  description: string;
  image: string;
}

export interface Winner {
  name: string;
  phone: string;
  city: string;
  avatar?: string;
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  city: string;
  tickets: number;
  status: ParticipantStatus;
  lotteryId: string;
  proof?: boolean;
  avatar?: string;
}

export interface Lottery {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  banner?: string;
  prize?: Prize;
  ticketPrice: number;
  startDate?: string;
  endDate?: string;
  startAt?: string;
  endAt?: string;
  status: LotteryStatus;
  participants?: number;
  revenue?: number;
  winners?: Winner[];
  createdAt?: string;
  pendingApprovals?: number;
  ticketNumber?: number;
  currency?: string;
}

export interface LotteryStats {
  all: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  goToPage: string;
}
