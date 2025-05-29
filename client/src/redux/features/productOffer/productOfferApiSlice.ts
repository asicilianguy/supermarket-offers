import { apiSlice } from "../../app/api/apiSlice"

export const productOfferApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAisles: builder.query<string[], void>({
      query: () => "offers/aisles",
    }),
  }),
})

export const { useGetAllAislesQuery } = productOfferApiSlice
