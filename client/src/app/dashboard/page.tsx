"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useGetUserProfileQuery } from "@/redux/features/user/userApiSlice"
import { useGetOffersForShoppingListQuery } from "@/redux/features/productOffer/productOfferApiSlice"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ShoppingList from "@/components/dashboard/ShoppingList"
import OfferRecommendations from "@/components/dashboard/OfferRecommendations"
import BestOffers from "@/components/dashboard/BestOffers"
import SupermarketOffers from "@/components/dashboard/SupermarketOffers"

export default function Dashboard() {
  const router = useRouter()
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetUserProfileQuery(undefined)
  const { data: shoppingListOffers, isLoading: isLoadingOffers } = useGetOffersForShoppingListQuery(undefined, {
    skip: !user,
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    console.log("Dashboard - Token check:", token ? "Token exists" : "No token")

    if (!token) {
      console.log("No token found, redirecting to login")
      router.push("/login")
    }
  }, [router])

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (isErrorUser) {
    router.push("/login")
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />

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
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OfferRecommendations offers={shoppingListOffers || []} isLoading={isLoadingOffers} />
        </motion.div>
      </div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <BestOffers />
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SupermarketOffers frequentedSupermarkets={user.frequentedSupermarkets} />
      </motion.div>
    </div>
  )
}
