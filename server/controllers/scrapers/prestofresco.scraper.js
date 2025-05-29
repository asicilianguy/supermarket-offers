import fs from "fs";
import path from "path";
import os from "os";
import { chromium } from "playwright";
import { delay, withRetry } from "../../utils/browserUtils.js";
import { convertPdfToImages } from "../../utils/pdfUtils.js";
import { processProductImages } from "../../services/aiService.js";
import fetch from "node-fetch";

import express from "express";
const router = express.Router();

// Definizione della route per lo scraping di PrestoFresco
const prestofrescoScraper = async (req, res) => {
  let browser;
  let tempDir = null;

  try {
    // Crea una directory temporanea
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prestofresco-scraper-"));

    // Avvia il browser
    browser = await chromium.launch({
      headless: true,
    });

    // Crea un contesto con impostazioni realistiche
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      acceptDownloads: true,
      navigationTimeout: 60000,
    });

    // Crea una pagina
    const page = await context.newPage();

    // Vai direttamente alla pagina del punto vendita CON RETRY
    await withRetry(
      async () => {
        await page.goto(
          "https://prestofresco.it/punto-vendita/nichelino-via-martiri-30/VmlhIE1hcnRpcmksIDMwTklDSEVMSU5P/#store",
          {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          }
        );
        await page.waitForSelector("body", {
          state: "visible",
          timeout: 10000,
        });
      },
      3,
      5000
    );

    // Gestione banner cookie
    try {
      // Cerca vari tipi di banner cookie comuni
      const cookieSelectors = [
        "#cookie-law-info-bar",
        "#cookie-notice",
        ".cookie-banner",
        "#cookie-banner",
        ".cookieconsent",
        "[id*='cookie']",
        "[class*='cookie']",
        "[id*='gdpr']",
        "[class*='gdpr']",
        ".consent-banner",
        ".privacy-consent",
        "#cookieChoiceInfo",
        ".js-cookie-consent",
      ];

      for (const selector of cookieSelectors) {
        const bannerExists = await page.$(selector);
        if (bannerExists) {
          // Cerca pulsanti di accettazione
          const acceptButtons = [
            "#wt-cli-accept-all-btn",
            "#cookie_action_close_header",
            "#cn-accept-cookie",
            "button.accept-cookies",
            'button[data-cli_action="accept"]',
            'a[data-cli_action="accept"]',
            'button:has-text("Accetta")',
            'button:has-text("Accetta tutti")',
            'button:has-text("Accetto")',
            'button:has-text("OK")',
            'button:has-text("Continua")',
            'a:has-text("Accetta")',
            'a:has-text("Accetta tutti")',
            "a.accept-cookies",
            'a[href*="accept-cookies"]',
            "button.btn-primary",
            ".cookie-consent-btn",
            ".btn-cookies-accepted",
          ];

          for (const buttonSelector of acceptButtons) {
            try {
              const button = await page.$(buttonSelector);
              if (button) {
                await button.click();
                await delay(1000);
                break;
              }
            } catch (e) {
              console.log(
                `Errore nel click sul pulsante ${buttonSelector}:`,
                e.message
              );
            }
          }

          break;
        }
      }
    } catch (e) {
      // Banner cookie non trovato o già gestito
      console.log("Errore nella gestione dei cookie:", e.message);
    }

    // Attendi un po' per essere sicuri che la pagina sia caricata completamente
    await delay(3000);

    // Trova il link di download del volantino
    let pdfUrl = null;

    // Primo approccio: cerchiamo il link specifico fornito
    try {
      // Attendi che il selettore sia visibile, con un timeout ragionevole
      await page
        .waitForSelector('a.pf_btn.white_button[href*="volantino"]', {
          timeout: 5000,
        })
        .catch(() => {
          console.log("Link al volantino non trovato immediatamente");
        });

      // Cerca il link specifico
      const downloadButton = await page.$(
        'a.pf_btn.white_button[href*="volantino"]'
      );

      if (downloadButton) {
        pdfUrl = await downloadButton.getAttribute("href");
        console.log("Link al volantino trovato:", pdfUrl);
      }
    } catch (e) {
      console.log("Errore nel primo approccio:", e.message);
    }

    // Secondo approccio: cerca qualsiasi link con testo indicativo
    if (!pdfUrl) {
      try {
        const downloadSelectors = [
          'a:has-text("Scarica volantino")',
          'a:has-text("scarica volantino")',
          'a:has-text("SCARICA VOLANTINO")',
          'a[href*="volantino"]',
          'a[href*=".pdf"]',
        ];

        for (const selector of downloadSelectors) {
          try {
            const link = await page.$(selector);
            if (link) {
              pdfUrl = await link.getAttribute("href");
              console.log(`Link trovato con selettore "${selector}":`, pdfUrl);
              break;
            }
          } catch (e) {
            console.log(`Errore con selettore ${selector}:`, e.message);
          }
        }
      } catch (e) {
        console.log("Errore nel secondo approccio:", e.message);
      }
    }

    // Terzo approccio: cerca qualsiasi link PDF
    if (!pdfUrl) {
      try {
        const pdfUrls = await page.evaluate(() => {
          // Cerca tutti i link che puntano a PDF
          const pdfLinks = Array.from(
            document.querySelectorAll('a[href$=".pdf"], a[href*=".pdf"]')
          );
          return pdfLinks.map((link) => link.href);
        });

        if (pdfUrls && pdfUrls.length > 0) {
          pdfUrl = pdfUrls[0];
          console.log("Link PDF trovato con il terzo approccio:", pdfUrl);
        }
      } catch (e) {
        console.log("Errore nel terzo approccio:", e.message);
      }
    }

    // Verifica se abbiamo trovato un URL PDF
    if (!pdfUrl) {
      // Fallback all'URL fornito nell'esempio se nessun altro metodo funziona
      pdfUrl =
        "https://media.etihub.it/prestofresco/volantino_1747969246488.pdf";
      console.log("Utilizzo dell'URL PDF di fallback:", pdfUrl);
    }

    let allProductsInfo = [];

    // Download del PDF e analisi dei prodotti
    await withRetry(
      async () => {
        console.log("Tentativo di download del PDF da:", pdfUrl);

        // Scarica il PDF direttamente
        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok)
          throw new Error(`HTTP error! status: ${pdfResponse.status}`);

        const buffer = await pdfResponse.arrayBuffer();

        // Salva temporaneamente il PDF nella directory temporanea
        const tempFileName = `prestofresco_volantino_${Date.now()}.pdf`;
        const tempFilePath = path.join(tempDir, tempFileName);

        fs.writeFileSync(tempFilePath, Buffer.from(buffer));
        console.log("PDF scaricato temporaneamente:", tempFilePath);

        // Converti il PDF in immagini (sempre nella directory temporanea)
        console.log("Conversione del PDF in immagini...");
        const imageFiles = await convertPdfToImages(tempFilePath, tempDir);

        // Se la conversione ha avuto successo, analizza le immagini
        if (imageFiles && imageFiles.length > 0) {
          // Analizza le immagini e ottieni informazioni sui prodotti
          console.log("Analisi delle immagini dei prodotti...");
          const productsAnalysis = await processProductImages(
            imageFiles,
            "prestofresco"
          );

          // Estrai tutti i prodotti e appiattiscili in un unico array
          for (const pageResult of productsAnalysis) {
            if (Array.isArray(pageResult.productInfo)) {
              // Se productInfo è già un array
              allProductsInfo = [...allProductsInfo, ...pageResult.productInfo];
            } else if (
              typeof pageResult.productInfo === "object" &&
              pageResult.productInfo !== null
            ) {
              // Se è un singolo oggetto prodotto
              allProductsInfo.push(pageResult.productInfo);
            }
          }
        }
      },
      3,
      3000
    );

    // Invia i prodotti all'endpoint batch
    if (allProductsInfo.length > 0) {
      try {
        const batchResponse = await fetch(
          `${
            process.env.API_BASE_URL || "http://localhost:3001"
          }/api/offers/batch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productsInfo: allProductsInfo }),
          }
        );

        const batchResult = await batchResponse.json();

        // Restituisci sia i prodotti che il risultato dell'operazione batch
        res.json({
          success: true,
          productsInfo: allProductsInfo,
          batchResult,
        });
      } catch (error) {
        console.error(
          "Errore nell'invio dei prodotti all'endpoint batch:",
          error
        );
        // Se l'invio all'endpoint batch fallisce, restituisci comunque i prodotti
        res.json({
          success: true,
          productsInfo: allProductsInfo,
          batchError: error.message,
        });
      }
    } else {
      // Se non ci sono prodotti da inviare
      res.json({
        success: false,
        message: "Nessun prodotto estratto dal volantino",
      });
    }
  } catch (error) {
    console.error("Errore nello scraping di PrestoFresco:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  } finally {
    // Chiudi il browser
    if (browser) {
      await browser.close();
    }

    // Pulisci i file temporanei
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        // Elimina tutti i file in modo ricorsivo
        const deleteFilesRecursively = (dirPath) => {
          if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach((file) => {
              const curPath = path.join(dirPath, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                // Ricorsione per sottodirectory
                deleteFilesRecursively(curPath);
              } else {
                // Elimina file
                fs.unlinkSync(curPath);
              }
            });

            // Elimina directory vuote (eccetto la directory principale)
            if (dirPath !== tempDir) {
              fs.rmdirSync(dirPath);
            }
          }
        };

        deleteFilesRecursively(tempDir);

        // Infine, elimina la directory principale
        fs.rmdirSync(tempDir);
        console.log("Directory temporanea eliminata:", tempDir);
      } catch (error) {
        console.error("Errore durante la pulizia dei file temporanei:", error);
      }
    }
  }
};

export default prestofrescoScraper;
