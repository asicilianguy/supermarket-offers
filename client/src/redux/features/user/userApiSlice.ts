import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define the base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      // If we have a token, add it to the headers
      if (token) {
        headers.set("x-auth-token", token)
      }

      return headers
    },
  }),
  tagTypes: ["User", "ShoppingList"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateFrequentedSupermarkets: builder.mutation({
      query: (data) => ({
        url: "/users/supermarkets",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getShoppingList: builder.query({
      query: () => "/users/shopping-list",
      providesTags: ["ShoppingList"],
    }),
    addToShoppingList: builder.mutation({
      query: (item) => ({
        url: "/users/shopping-list",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["ShoppingList"],
    }),
    removeFromShoppingList: builder.mutation({
      query: (itemId) => ({
        url: `/users/shopping-list/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShoppingList"],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserProfileQuery,
  useUpdateFrequentedSupermarketsMutation,
  useGetShoppingListQuery,
  useAddToShoppingListMutation,
  useRemoveFromShoppingListMutation,
} = userApiSlice
