import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import dotenv from "dotenv"

dotenv.config()

// Register a new user
export const registerUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, phoneNumber, password, frequentedSupermarkets } = req.body

  try {
    // Format phone number to ensure it has the +39 prefix
    let formattedPhoneNumber = phoneNumber
    if (!phoneNumber.startsWith("+39")) {
      formattedPhoneNumber = "+39" + phoneNumber.replace(/^0/, "")
    }

    // Check if user already exists
    let user = await User.findOne({ phoneNumber: formattedPhoneNumber })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      phoneNumber: formattedPhoneNumber,
      password,
      frequentedSupermarkets,
      shoppingList: [],
    })

    await user.save()

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error("Error in registerUser:", err.message)
    res.status(500).send("Server error")
  }
}

// Login user
export const loginUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { phoneNumber, password } = req.body

  try {
    // Format phone number to ensure it has the +39 prefix
    let formattedPhoneNumber = phoneNumber
    if (!phoneNumber.startsWith("+39")) {
      formattedPhoneNumber = "+39" + phoneNumber.replace(/^0/, "")
    }

    // Check if user exists
    const user = await User.findOne({ phoneNumber: formattedPhoneNumber })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error("Error in loginUser:", err.message)
    res.status(500).send("Server error")
  }
}

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    console.error("Error in getUserProfile:", err.message)
    res.status(500).send("Server error")
  }
}

// Update frequented supermarkets
export const updateFrequentedSupermarkets = async (req, res) => {
  const { frequentedSupermarkets } = req.body

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.frequentedSupermarkets = frequentedSupermarkets
    await user.save()

    res.json(user)
  } catch (err) {
    console.error("Error in updateFrequentedSupermarkets:", err.message)
    res.status(500).send("Server error")
  }
}

// Add item to shopping list
export const addToShoppingList = async (req, res) => {
  const { productName, notes } = req.body

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.shoppingList.push({ productName, notes })
    await user.save()

    res.json(user.shoppingList)
  } catch (err) {
    console.error("Error in addToShoppingList:", err.message)
    res.status(500).send("Server error")
  }
}

// Remove item from shopping list
export const removeFromShoppingList = async (req, res) => {
  const { itemId } = req.params

  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.shoppingList = user.shoppingList.filter((item) => item._id.toString() !== itemId)
    await user.save()

    res.json(user.shoppingList)
  } catch (err) {
    console.error("Error in removeFromShoppingList:", err.message)
    res.status(500).send("Server error")
  }
}

// Get shopping list
export const getShoppingList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user.shoppingList)
  } catch (err) {
    console.error("Error in getShoppingList:", err.message)
    res.status(500).send("Server error")
  }
}
