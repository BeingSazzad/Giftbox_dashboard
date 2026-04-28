import { api } from "../api";

const profileApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "PATCH",
        body: data,
      }),
    }),
    // change password

    changePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
