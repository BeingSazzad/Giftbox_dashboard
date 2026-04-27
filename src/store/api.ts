import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getFromLocalStorage, TOKEN_STORAGE_KEY } from "../utils/local-storage";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.10.7.9:5001/api/v1" ,
    baseUrl: "http://10.10.7.93:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = getFromLocalStorage(TOKEN_STORAGE_KEY);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        headers.delete("Authorization");
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User"],
});

export const imageUrl = "http://10.10.7.93:5000";
