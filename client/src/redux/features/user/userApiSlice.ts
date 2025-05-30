import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ShoppingListItem,
  AddShoppingListItemPayload,
  UpdateSupermarketsPayload,
  UserShoppingListResponse,
} from "@/types"

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/users`,
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (token) {
        headers.set("x-auth-token", token)
      }
      return headers
    },
  }),
  tagTypes: ["User", "ShoppingList"],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // User profile endpoints
    getUserProfile: builder.query<User, void>({
      query: () => "/profile",
      providesTags: ["User"],
    }),

    updateFrequentedSupermarkets: builder.mutation<User, UpdateSupermarketsPayload>({
      query: (data) => ({
        url: "/supermarkets",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Shopping list endpoints
    getShoppingList: builder.query<ShoppingListItem[], void>({
      query: () => "/shopping-list",
      providesTags: ["ShoppingList"],
      transformResponse: (response: UserShoppingListResponse) => response.data,
    }),

    addToShoppingList: builder.mutation<ShoppingListItem, AddShoppingListItemPayload>({
      query: (item) => ({
        url: "/shopping-list",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["ShoppingList"],
    }),

    removeFromShoppingList: builder.mutation<{ success: boolean; message: string }, string>({
      query: (itemId) => ({
        url: `/shopping-list/${itemId}`,
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
