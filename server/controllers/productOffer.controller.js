import ProductOffer from "../models/ProductOffer.js"
import { VALID_AISLES } from "../constants/aisles.js"

// @desc   Get all product offers
// @route  GET /api/product-offers
// @access Public
export const getAllOffers = async (req, res) => {
  try {
    const {
      supermarket,
      supermarketAisle,
      productName,
      offerPriceLessThan,
      offerPriceGreaterThan,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query

    const query = { offerEndDate: { $gte: new Date() } }

    if (supermarket) query.supermarket = supermarket
    if (supermarketAisle) query.supermarketAisle = supermarketAisle
    if (productName) query.productName = { $regex: productName, $options: "i" } // 'i' for case-insensitive search
    if (offerPriceLessThan) query.offerPrice = { $lt: offerPriceLessThan }
    if (offerPriceGreaterThan) query.offerPrice = { $gt: offerPriceGreaterThan }

    const sortOptions = {}
    if (sortBy) {
      const [field, order] = sortBy.split(":")
      sortOptions[field] = order === "desc" ? -1 : 1
    }

    const skip = (page - 1) * limit

    const offers = await ProductOffer.find(query).sort(sortOptions).skip(skip).limit(limit)

    const totalOffers = await ProductOffer.countDocuments(query)

    res.json({
      data: offers,
      total: totalOffers,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      totalPages: Math.ceil(totalOffers / limit),
    })
  } catch (err) {
    console.error("Error in getAllOffers:", err.message)
    res.status(500).send("Server error")
  }
}

// @desc   Get product offers by aisle
// @route  GET /api/product-offers/aisle/:aisle
// @access Public
export const getOffersByAisle = async (req, res) => {
  try {
    const { aisle } = req.params
    const query = {
      supermarketAisle: aisle, // Questo cercherà 'aisle' all'interno dell'array supermarketAisle nel DB
      offerEndDate: { $gte: new Date() },
    }

    const offers = await ProductOffer.find(query)
    res.json(offers)
  } catch (err) {
    console.error("Error in getOffersByAisle:", err.message)
    res.status(500).send("Server error")
  }
}

// @desc   Get all distinct aisles
// @route  GET /api/product-offers/aisles
// @access Public
export const getAllAisles = async (req, res) => {
  try {
    res.json(VALID_AISLES)
  } catch (err) {
    console.error("Error in getAllAisles:", err.message)
    res.status(500).send("Server error")
  }
}

// @desc   Create a new product offer
// @route  POST /api/product-offers
// @access Public
export const createOffer = async (req, res) => {
  try {
    const newOffer = new ProductOffer(req.body)
    const savedOffer = await newOffer.save()
    res.status(201).json(savedOffer)
  } catch (err) {
    console.error("Error in createOffer:", err.message)
    res.status(500).send("Server error")
  }
}

// @desc   Update a product offer
// @route  PUT /api/product-offers/:id
// @access Public
export const updateOffer = async (req, res) => {
  try {
    const updatedOffer = await ProductOffer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedOffer) {
      return res.status(404).send("Offer not found")
    }
    res.json(updatedOffer)
  } catch (err) {
    console.error("Error in updateOffer:", err.message)
    res.status(500).send("Server error")
  }
}

// @desc   Delete a product offer
// @route  DELETE /api/product-offers/:id
// @access Public
export const deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await ProductOffer.findByIdAndDelete(req.params.id)
    if (!deletedOffer) {
      return res.status(404).send("Offer not found")
    }
    res.status(204).send() // 204 No Content
  } catch (err) {
    console.error("Error in deleteOffer:", err.message)
    res.status(500).send("Server error")
  }
}
