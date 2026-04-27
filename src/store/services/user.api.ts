import { api } from "../api";

const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    // getUser endpoint
    getUser: build.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
    }),
    // all users endpoint
    getAllUsers: build.query({
      query: ({ page, searchTerm, status, city, limit }) => ({
        url: "/users",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm && { searchTerm }),
          ...(status !== "All" && { status }),
          ...(city !== "All" && { city }),
        },
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetAllUsersQuery } = userApi;
