import { api } from "../api";

const createAdminApi = api.injectEndpoints({
  endpoints: (build) => ({
    createAdmin: build.mutation({
      query: (adminData) => ({
        url: "/users/create-admin",
        method: "POST",
        body: adminData,
      }),
    }),
    // get all user
    getAllAdminFromDB: build.query({
      query: () => ({
        url: "/users/admins",
        method: "GET",
      }),
    }),
    // delete user
    deleteAdminFromDB: build.mutation({
      query: (id) => ({
        url: `/users/admins/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateAdminMutation, useGetAllAdminFromDBQuery, useDeleteAdminFromDBMutation } =
  createAdminApi;
