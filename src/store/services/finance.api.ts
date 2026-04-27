import { api } from "../api";

const financeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAnalyticsPayment: build.query({
      query: (params) => ({
        url: "/analytics/finance-and-payments-stats",
        method: "GET",
        params,
      }),
    }),
  }),
});
export const { useGetAnalyticsPaymentQuery } = financeApi;
