import mongoose from "mongoose"
import { VALID_AISLES } from "../constants/aisles.js"

const productOfferSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountedPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  supermarketName: {
    type: String,
    required: true,
    trim: true,
  },
  supermarketLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  supermarketAisle: {
    type: [String], // Modificato da String a [String]
    required: true,
    validate: {
      validator: (v) => {
        // v sarà un array di stringhe
        if (!Array.isArray(v) || v.length === 0) {
          return false // Deve essere un array non vuoto
        }
        return v.every((aisle) => VALID_AISLES.includes(aisle))
      },
      message: (props) => `${props.value} contiene reparti non validi!`,
    },
    // trim non è applicabile direttamente a un array, ma a ciascun elemento.
    // La validazione con includes si occuperà di questo.
  },
  offerExpiryDate: {
    type: Date,
    required: true,
  },
  offerPostedDate: {
    type: Date,
    default: Date.now,
  },
  // Add any other relevant fields here
})

productOfferSchema.index({ supermarketLocation: "2dsphere" })
productOfferSchema.index({ supermarketAisle: 1 }) // Query by aisle (rimane uguale, Mongoose gestisce gli array)

const ProductOffer = mongoose.model("ProductOffer", productOfferSchema)

export default ProductOffer
