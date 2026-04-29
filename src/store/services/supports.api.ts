import { api } from "../api";

const supportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllSupports: build.query({
      query: ({ params }) => ({
        url: "/supports",
        method: "GET",
        params: {
          ...params,
        },
      }),
    }),
    updateSupportStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/supports/${id}/review`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const { useGetAllSupportsQuery, useUpdateSupportStatusMutation } =
  supportsApi;
