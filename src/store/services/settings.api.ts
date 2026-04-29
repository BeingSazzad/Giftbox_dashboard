import { api } from "../api";

const settingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    postPaymentNumber: build.mutation({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
    }),
    getPaymentNumber: build.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
    }),
  }),
});
export const { usePostPaymentNumberMutation, useGetPaymentNumberQuery } = settingsApi;
