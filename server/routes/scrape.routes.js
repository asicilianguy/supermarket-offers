import express from "express"
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
import { scrapeAll, getScrapingStatus } from "../controllers/scrapers/scraper.controller.js"

const router = express.Router()

// Definizione delle route per ogni supermercato
router.get("/esselunga", esselungaScraper)
router.get("/conad", conadScraper)
router.get("/lidl", lidlScraper)
router.get("/eurospin", eurospinScraper)
router.get("/bennet", bennetScraper)
router.get("/auchan", auchanScraper)
router.get("/penny", pennyScraper)
router.get("/despar", desparScraper)
router.get("/centesimo", centesimoScraper)
router.get("/carrefouriper", carrefouriperScraper)
router.get("/carrefourexpress", carrefourexpressScraper)
router.get("/prestofresco", prestofrescoScraper)
router.get("/carrefourmarket", carrefourmarketScraper)
router.get("/gigante", giganteScraper)
router.get("/ins", insScraper)
router.get("/todis", todisScraper)
router.get("/md", mdScraper)
router.get("/crai", craiScraper)
router.get("/paghipoco", paghipocoScraper)

// Route per scraping di tutti i supermercati
router.get("/all", scrapeAll)

// Route per ottenere lo stato dello scraping
router.get("/status", getScrapingStatus)

export default router
