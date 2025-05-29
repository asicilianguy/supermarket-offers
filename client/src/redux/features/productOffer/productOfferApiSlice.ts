import { apiSlice } from "../../app/api/apiSlice"

interface Offer {
  _id: string
  productName: string
  productQuantity?: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  pricePerKg?: number
  pricePerLiter?: number
  offerStartDate: string
  offerEndDate: string
  brand?: string
  supermarketAisle: string[]
  chainName: string
  createdAt: string
  updatedAt: string
}

interface OffersResponse {
  offers: Offer[]
  totalPages: number
  currentPage: number
}

interface ShoppingListOffer {
  productName: string
  offers: Offer[]
}

export const productOfferApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all offers with optional filters
    getAllOffers: builder.query<
      OffersResponse,
      {
        page?: number
        limit?: number
        chainName?: string
        supermarketAisle?: string
        brand?: string
        sort?: string
      }
    >({
      query: (params) => ({
        url: "/offers",
        params,
      }),
      providesTags: ["Offers"],
    }),

    // Get offers by supermarket
    getOffersBySupermarket: builder.query<
      OffersResponse,
      {
        chainName: string
        page?: number
        limit?: number
        sort?: string
      }
    >({
      query: ({ chainName, ...params }) => ({
        url: `/offers/supermarket/${chainName}`,
        params,
      }),
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
      query: ({ query, ...params }) => ({
        url: `/offers/search/${query}`,
        params,
      }),
      providesTags: ["Offers"],
    }),

    // Get offers for user's shopping list
    getOffersForShoppingList: builder.query<ShoppingListOffer[], void>({
      query: () => "/offers/shopping-list",
      providesTags: ["Offers", "ShoppingList"],
    }),

    // Get best offers (highest discount)
    getBestOffers: builder.query<Offer[], { limit?: number }>({
      query: (params) => ({
        url: "/offers/best",
        params,
      }),
      providesTags: ["Offers"],
    }),

    // Get offers by aisle
    getOffersByAisle: builder.query<
      OffersResponse,
      {
        aisle: string
        page?: number
        limit?: number
        chainName?: string
      }
    >({
      query: ({ aisle, ...params }) => ({
        url: `/offers/aisle/${aisle}`,
        params,
      }),
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
      query: ({ brand, ...params }) => ({
        url: `/offers/brand/${brand}`,
        params,
      }),
      providesTags: ["Offers"],
    }),

    // Get all available brands
    getAllBrands: builder.query<string[], void>({
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
  useGetAllBrandsQuery,
} = productOfferApiSlice
