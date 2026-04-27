export type LotteryForm = {
  title: string;
  description: string;
  banner: string | null;
  ticketPrice: number;
  publishInstantly: boolean;
  startDate: string;
  endDate: string;
  status: string;
};
