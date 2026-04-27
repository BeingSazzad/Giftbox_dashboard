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
      query: ({page, searchTerm}) => ({
        url: "/users",
        method: "GET",
        params: { page, searchTerm },
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetAllUsersQuery } = userApi;
