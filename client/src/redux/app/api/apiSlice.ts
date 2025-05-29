import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      // If we have a token, add it to the headers
      if (token) {
        headers.set("x-auth-token", token)
      }

      return headers
    },
  }),
  tagTypes: ["Offers", "User", "ShoppingList"],
  endpoints: (builder) => ({}),
})
