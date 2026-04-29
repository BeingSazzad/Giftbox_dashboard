import { api } from "../api";

const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    // getDashboardData endpoint
    getDashboardData: build.query({
      query: () => ({
        url: "/analytics/admin-dashboard-stats",
        method: "GET",
      }),
    }),
    // analytics ticket endpoint
    getAnalyticsTickets: build.query({
      query: (year: number) => ({
        url: `/analytics/yearly-ticket-stats?year=${encodeURIComponent(
          String(year),
        )}`,
        method: "GET",
      }),
    }),

    // monthly income cdf
    getMonthlyIncomeCDF: build.query({
      query: (year: number) => ({
        url: `/analytics/yearly-revenue-stats?year=${encodeURIComponent(
          String(year),
        )}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetDashboardDataQuery,
  useGetAnalyticsTicketsQuery,
  useGetMonthlyIncomeCDFQuery,
} = dashboardApi;
