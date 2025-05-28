import express from "express"
import { check } from "express-validator"
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateFrequentedSupermarkets,
  addToShoppingList,
  removeFromShoppingList,
  getShoppingList,
} from "../controllers/user.controller.js"
import auth from "../middleware/auth.middleware.js"

const router = express.Router()

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("phoneNumber", "Valid phone number is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("frequentedSupermarkets", "Frequented supermarkets must be an array").isArray(),
  ],
  registerUser,
)

// @route   POST api/users/login
// @desc    Login user & get token
// @access  Public
router.post(
  "/login",
  [
    check("phoneNumber", "Phone number is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ],
  loginUser,
)

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, getUserProfile)

// @route   PUT api/users/supermarkets
// @desc    Update frequented supermarkets
// @access  Private
router.put("/supermarkets", auth, updateFrequentedSupermarkets)

// @route   POST api/users/shopping-list
// @desc    Add item to shopping list
// @access  Private
router.post("/shopping-list", auth, addToShoppingList)

// @route   DELETE api/users/shopping-list/:itemId
// @desc    Remove item from shopping list
// @access  Private
router.delete("/shopping-list/:itemId", auth, removeFromShoppingList)

// @route   GET api/users/shopping-list
// @desc    Get shopping list
// @access  Private
router.get("/shopping-list", auth, getShoppingList)

export default router
