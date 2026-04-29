import { api } from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // login endpoint
    login: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
