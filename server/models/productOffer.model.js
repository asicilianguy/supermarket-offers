import mongoose from "mongoose"

const VALID_SUPERMARKETS = [
  "esselunga",
  "conad",
  "lidl",
  "eurospin",
  "bennet",
  "auchan",
  "penny",
  "despar",
  "centesimo",
  "carrefouriper",
  "carrefourexpress",
  "prestofresco",
  "carrefourmarket",
  "gigante",
  "ins",
  "todis",
  "md",
  "crai",
  "paghipoco",
]

const productOfferSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productQuantity: {
      type: String,
      trim: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    previousPrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    pricePerKg: {
      type: Number,
    },
    pricePerLiter: {
      type: Number,
    },
    offerStartDate: {
      type: Date,
      required: true,
    },
    offerEndDate: {
      type: Date,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    supermarketAisle: {
      type: String,
      required: true,
      trim: true,
    },
    chainName: {
      type: String,
      required: true,
      enum: VALID_SUPERMARKETS,
    },
  },
  { timestamps: true },
)

// Create indexes for better performance
productOfferSchema.index({ productName: "text", brand: "text" }) // Text search index
productOfferSchema.index({ chainName: 1 }) // Query by supermarket
productOfferSchema.index({ supermarketAisle: 1 }) // Query by aisle
productOfferSchema.index({ offerEndDate: 1 }) // Query for active offers
productOfferSchema.index({ offerPrice: 1 }) // Sort by price
productOfferSchema.index({ discountPercentage: -1 }) // Sort by discount

const ProductOffer = mongoose.model("ProductOffer", productOfferSchema)

export default ProductOffer
