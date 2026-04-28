import { api } from "../api";

const lotteryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllLottery: build.query({
      query: ({ page, searchTerm, status, mode }) => ({
        url: "/lottery",
        method: "GET",
        params: { page, search: searchTerm, status, mode },
      }),
    }),
  }),
});

export const { useGetAllLotteryQuery } = lotteryApi;
