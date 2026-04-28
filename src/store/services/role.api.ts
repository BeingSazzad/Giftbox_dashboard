import { api } from "../api";

const roleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query({
      query: () => ({
        url: "/rules/terms",
        method: "GET",
      }),
    }),
    getRolesAbout: build.query({
      query: () => ({
        url: "/rules/about",
        method: "GET",
      }),
    }),
    getRolesPrivacy: build.query({
      query: () => ({
        url: "/rules/privacy",
        method: "GET",
      }),
    }),
    // update terms and conditions
    createRoles: build.mutation({
      query: (data) => ({
        url: "/rules",
        method: "POST",
        body: data,
      }),
    }),
    createAboutRoles: build.mutation({
      query: (data) => ({
        url: "/rules",
        method: "POST",
        body: data,
      }),
    }),
    createPrivacyRoles: build.mutation({
      query: (data) => ({
        url: "/rules",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetRolesQuery,
  useGetRolesAboutQuery,
  useGetRolesPrivacyQuery,
  //   update
  useCreateRolesMutation,
  useCreateAboutRolesMutation,
  useCreatePrivacyRolesMutation,
} = roleApi;
