import mongoose from "mongoose";
import { VALID_AISLES } from "../constants/aisles.js";
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
];

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
      type: [String], // Cambiato da String a [String]
      required: true,
      validate: {
        validator: (aisles) => {
          // Verifica che sia un array non vuoto
          if (!Array.isArray(aisles) || aisles.length === 0) {
            return false;
          }
          // Verifica che ogni elemento sia un reparto valido
          return aisles.every((aisle) => VALID_AISLES.includes(aisle));
        },
        message:
          "I reparti devono essere validi e almeno uno deve essere specificato",
      },
    },
    chainName: {
      type: String,
      required: true,
      enum: VALID_SUPERMARKETS,
    },
  },
  { timestamps: true }
);

// Create indexes for better performance
productOfferSchema.index({ productName: "text", brand: "text" }); // Text search index
productOfferSchema.index({ chainName: 1 }); // Query by supermarket
productOfferSchema.index({ supermarketAisle: 1 }); // Query by aisle (funziona anche con array)
productOfferSchema.index({ offerEndDate: 1 }); // Query for active offers
productOfferSchema.index({ offerPrice: 1 }); // Sort by price
productOfferSchema.index({ discountPercentage: -1 }); // Sort by discount

const ProductOffer = mongoose.model("ProductOffer", productOfferSchema);

export default ProductOffer;
