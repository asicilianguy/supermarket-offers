import express from "express"
import { scrapeAll, getScrapingStatus } from "../controllers/scrapers/scraper.controller.js"

// Importa dinamicamente tutti gli scraper
import esselungaScraper from "../controllers/scrapers/esselunga.scraper.js"
import conadScraper from "../controllers/scrapers/conad.scraper.js"
import lidlScraper from "../controllers/scrapers/lidl.scraper.js"
import eurospinScraper from "../controllers/scrapers/eurospin.scraper.js"
import bennetScraper from "../controllers/scrapers/bennet.scraper.js"
import auchanScraper from "../controllers/scrapers/auchan.scraper.js"
import pennyScraper from "../controllers/scrapers/penny.scraper.js"
import desparScraper from "../controllers/scrapers/despar.scraper.js"
import centesimoScraper from "../controllers/scrapers/centesimo.scraper.js"
import carrefouriperScraper from "../controllers/scrapers/carrefouriper.scraper.js"
import carrefourexpressScraper from "../controllers/scrapers/carrefourexpress.scraper.js"
import prestofrescoScraper from "../controllers/scrapers/prestofresco.scraper.js"
import carrefourmarketScraper from "../controllers/scrapers/carrefourmarket.scraper.js"
import giganteScraper from "../controllers/scrapers/gigante.scraper.js"
import insScraper from "../controllers/scrapers/ins.scraper.js"
import todisScraper from "../controllers/scrapers/todis.scraper.js"
import mdScraper from "../controllers/scrapers/md.scraper.js"
import craiScraper from "../controllers/scrapers/crai.scraper.js"
import paghipocoScraper from "../controllers/scrapers/paghipoco.scraper.js"

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

// Mappa dei nomi dei supermercati ai loro scraper
const scraperMap = {
  esselunga: esselungaScraper,
  conad: conadScraper,
  lidl: lidlScraper, //done
  eurospin: eurospinScraper, //done
  bennet: bennetScraper, //done
  auchan: auchanScraper,
  penny: pennyScraper,
  despar: desparScraper,
  centesimo: centesimoScraper,
  carrefouriper: carrefouriperScraper,
  carrefourexpress: carrefourexpressScraper,
  prestofresco: prestofrescoScraper,
  carrefourmarket: carrefourmarketScraper,
  gigante: giganteScraper,
  ins: insScraper,
  todis: todisScraper,
  md: mdScraper, //done
  crai: craiScraper,
  paghipoco: paghipocoScraper, //done
}

// Definizione delle route per ogni supermercato
SUPERMARKETS.forEach((supermarket) => {
  router.get(`/${supermarket}`, scraperMap[supermarket])
})

// Route per scraping di tutti i supermercati
router.get("/all", scrapeAll)

// Route per ottenere lo stato dello scraping
router.get("/status", getScrapingStatus)

export default router
