import express from "express"

const router = express.Router()

// List of all supermarkets
const SUPERMARKETS = [
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

// Initialize routes for each supermarket
SUPERMARKETS.forEach((supermarket) => {
  // @route   GET api/scrape/:supermarket
  // @desc    Scrape offers for a specific supermarket
  // @access  Private (to be implemented)
  router.get(`/${supermarket}`, (req, res) => {
    // This is just a placeholder. The actual scraping logic will be implemented manually.
    res.json({
      message: `Scraping route for ${supermarket} initialized. Actual scraping logic to be implemented manually.`,
      supermarket,
    })
  })
})

export default router
