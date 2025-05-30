import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ProductOffer, OffersResponse, ShoppingListOffersResponse } from "@/types"

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const offersApiSlice = createApi({
  reducerPath: "offersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/offers`,
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (token) {
        headers.set("x-auth-token", token)
      }
      return headers
    },
  }),
  tagTypes: ["Offers", "ShoppingListOffers"],
  endpoints: (builder) => ({
    // Get all offers with optional filters
    getAllOffers: builder.query<
      OffersResponse,
      {
        page?: number
        limit?: number
        supermarket?: string
        aisle?: string
        brand?: string
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/?${searchParams.toString()}`
      },
      providesTags: ["Offers"],
    }),

    // Get offers by supermarket
    getOffersBySupermarket: builder.query<
      OffersResponse,
      {
        chainName: string
        page?: number
        limit?: number
      }
    >({
      query: ({ chainName, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page.toString())
        if (limit) searchParams.append("limit", limit.toString())
        return `/supermarket/${chainName}?${searchParams.toString()}`
      },
      providesTags: ["Offers"],
    }),

    // Search offers by product name
    searchOffers: builder.query<
      OffersResponse,
      {
        query: string
        page?: number
        limit?: number
      }
    >({
      query: ({ query, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page.toString())
        if (limit) searchParams.append("limit", limit.toString())
        return `/search/${encodeURIComponent(query)}?${searchParams.toString()}`
      },
      providesTags: ["Offers"],
    }),

    // Get offers for user's shopping list
    getOffersForShoppingList: builder.query<
      Array<{
        productName: string
        offers: ProductOffer[]
      }>,
      void
    >({
      query: () => "/shopping-list",
      providesTags: ["ShoppingListOffers"],
      transformResponse: (response: ShoppingListOffersResponse) => response.data,
    }),

    // Get best offers (highest discount)
    getBestOffers: builder.query<ProductOffer[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => `/best?limit=${limit}`,
      providesTags: ["Offers"],
      transformResponse: (response: OffersResponse) => response.data,
    }),

    // Get offers by aisle
    getOffersByAisle: builder.query<
      OffersResponse,
      {
        aisle: string
        page?: number
        limit?: number
      }
    >({
      query: ({ aisle, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page.toString())
        if (limit) searchParams.append("limit", limit.toString())
        return `/aisle/${encodeURIComponent(aisle)}?${searchParams.toString()}`
      },
      providesTags: ["Offers"],
    }),

    // Get offers by brand
    getOffersByBrand: builder.query<
      OffersResponse,
      {
        brand: string
        page?: number
        limit?: number
      }
    >({
      query: ({ brand, page, limit }) => {
        const searchParams = new URLSearchParams()
        if (page) searchParams.append("page", page.toString())
        if (limit) searchParams.append("limit", limit.toString())
        return `/brand/${encodeURIComponent(brand)}?${searchParams.toString()}`
      },
      providesTags: ["Offers"],
    }),

    // Get all available aisles
    getAllAisles: builder.query<string[], void>({
      query: () => "/aisles",
      transformResponse: (response: { success: boolean; data: string[] }) => response.data,
    }),

    // Get all available brands
    getAllBrands: builder.query<string[], void>({
      query: () => "/brands",
      transformResponse: (response: { success: boolean; data: string[] }) => response.data,
    }),
  }),
})

export const {
  useGetAllOffersQuery,
  useGetOffersBySupermarketQuery,
  useSearchOffersQuery,
  useGetOffersForShoppingListQuery,
  useGetBestOffersQuery,
  useGetOffersByAisleQuery,
  useGetOffersByBrandQuery,
  useGetAllAislesQuery,
  useGetAllBrandsQuery,
} = offersApiSlice
