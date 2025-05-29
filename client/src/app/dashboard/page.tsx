"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useGetUserProfileQuery } from "@/redux/features/user/userApiSlice"
import {
  useGetOffersForShoppingListQuery,
  useGetBestOffersQuery,
  useGetAllOffersQuery,
} from "@/redux/features/productOffer/productOfferApiSlice"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ShoppingList from "@/components/dashboard/ShoppingList"
import OfferRecommendations from "@/components/dashboard/OfferRecommendations"
import BestOffers from "@/components/dashboard/BestOffers"
import PopularAislesGrid from "@/components/dashboard/PopularAislesGrid"
import SupermarketHighlights from "@/components/dashboard/SupermarketHighlights"
import AllOffersTeaser from "@/components/dashboard/AllOffersTeaser"

export default function Dashboard() {
  const router = useRouter()
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUserProfileQuery(undefined)
  const { data: shoppingListOffers, isLoading: isLoadingShoppingList } = useGetOffersForShoppingListQuery(undefined, {
    skip: !user,
  })
  const { data: bestOffers, isLoading: isLoadingBest } = useGetBestOffersQuery({ limit: 6 })
  const { data: allOffersData, isLoading: isLoadingAllOffers } = useGetAllOffersQuery({ page: 1, limit: 4 })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token && !isLoadingUser) {
      router.push("/login")
    }
  }, [router, isLoadingUser])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    )
  }

  if (isErrorUser || !user) {
    // Redirect handled by useEffect or user is null after loading
    return null
  }

  const popularAisles = [
    "frutta e verdura",
    "carne",
    "latticini",
    "bevande",
    "surgelati",
    "pane e pasticceria",
    "dispensa",
  ]
  const userFrequentedSupermarkets = user.frequentedSupermarkets || []

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <DashboardHeader user={user} />

      {/* Shopping List & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingList />
        </motion.div>
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <OfferRecommendations offers={shoppingListOffers || []} isLoading={isLoadingShoppingList} />
        </motion.div>
      </div>

      {/* Best Offers */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Le Migliori Offerte del Momento</h2>
        <BestOffers offers={bestOffers || []} isLoading={isLoadingBest} />
      </motion.div>

      {/* Popular Aisles Grid */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PopularAislesGrid aisles={popularAisles} />
      </motion.div>

      {/* Supermarket Highlights */}
      {userFrequentedSupermarkets.length > 0 && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Offerte dai tuoi Supermercati</h2>
          <SupermarketHighlights supermarkets={userFrequentedSupermarkets} />
        </motion.div>
      )}

      {/* All Offers Teaser */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Ultime Offerte Aggiunte</h2>
        <AllOffersTeaser offers={allOffersData?.offers || []} isLoading={isLoadingAllOffers} />
      </motion.div>
    </div>
  )
}
