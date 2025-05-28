import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define the base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const productOfferApiSlice = createApi({
  reducerPath: "productOfferApi",
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
  tagTypes: ["Offers"],
  endpoints: (builder) => ({
    getAllOffers: builder.query({
      query: (params) => ({
        url: "/offers",
        params,
      }),
      providesTags: ["Offers"],
    }),
    getOffersBySupermarket: builder.query({
      query: ({ chainName, ...params }) => ({
        url: `/offers/supermarket/${chainName}`,
        params,
      }),
    }),
    searchOffers: builder.query({
      query: ({ query, ...params }) => ({
        url: `/offers/search/${query}`,
        params,
      }),
    }),
    getOffersForShoppingList: builder.query({
      query: () => "/offers/shopping-list",
    }),
    getBestOffers: builder.query({
      query: (params) => ({
        url: "/offers/best",
        params,
      }),
    }),
    getOffersByAisle: builder.query({
      query: ({ aisle, ...params }) => ({
        url: `/offers/aisle/${aisle}`,
        params,
      }),
    }),
    getOffersByBrand: builder.query({
      query: ({ brand, ...params }) => ({
        url: `/offers/brand/${brand}`,
        params,
      }),
    }),
    getAllAisles: builder.query({
      query: () => "/offers/aisles",
    }),
    getAllBrands: builder.query({
      query: () => "/offers/brands",
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
} = productOfferApiSlice
