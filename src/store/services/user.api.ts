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
    // single user
    getSingleUser: build.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }), 
    // do user active and inactive
    updateUserStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/users/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const { useGetUserQuery, useGetAllUsersQuery, useGetSingleUserQuery, useUpdateUserStatusMutation } = userApi;
