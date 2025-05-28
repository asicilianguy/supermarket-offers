import express from "express"
import {
  getAllOffers,
  getOffersBySupermarket,
  searchOffers,
  getOffersForShoppingList,
  getBestOffers,
  getOffersByAisle,
  getOffersByBrand,
  getAllAisles,
  getAllBrands,
} from "../controllers/productOffer.controller.js"
import auth from "../middleware/auth.middleware.js"

const router = express.Router()

// @route   GET api/offers
// @desc    Get all offers with optional filters
// @access  Public
router.get("/", getAllOffers)

// @route   GET api/offers/supermarket/:chainName
// @desc    Get offers by supermarket
// @access  Public
router.get("/supermarket/:chainName", getOffersBySupermarket)

// @route   GET api/offers/search/:query
// @desc    Search offers by product name
// @access  Public
router.get("/search/:query", searchOffers)

// @route   GET api/offers/shopping-list
// @desc    Get offers for user's shopping list
// @access  Private
router.get("/shopping-list", auth, getOffersForShoppingList)

// @route   GET api/offers/best
// @desc    Get best offers (highest discount)
// @access  Public
router.get("/best", getBestOffers)

// @route   GET api/offers/aisle/:aisle
// @desc    Get offers by aisle
// @access  Public
router.get("/aisle/:aisle", getOffersByAisle)

// @route   GET api/offers/brand/:brand
// @desc    Get offers by brand
// @access  Public
router.get("/brand/:brand", getOffersByBrand)

// @route   GET api/offers/aisles
// @desc    Get all available aisles
// @access  Public
router.get("/aisles", getAllAisles)

// @route   GET api/offers/brands
// @desc    Get all available brands
// @access  Public
router.get("/brands", getAllBrands)

export default router
