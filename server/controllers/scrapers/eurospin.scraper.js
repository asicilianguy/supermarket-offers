// Controller per lo scraping di Eurospin
import fs from "fs";
import path from "path";
import os from "os";
import { chromium } from "playwright";
import { processProductImages } from "../../services/aiService.js";
import { delay, withRetry } from "../../utils/browserUtils.js";
import { convertPdfToImages } from "../../utils/pdfUtils.js";
import fetch from "node-fetch";

const eurospinScraper = async (req, res) => {
  let browser;
  let tempDir = null;

  try {
    // Crea una directory temporanea invece di usare DOWNLOAD_DIR
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "eurospin-scraper-"));

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

    // Configura un listener globale per intercettare tutte le richieste di PDF
    let pdfUrls = new Set();
    context.on("request", (request) => {
      const url = request.url();
      if (url.endsWith(".pdf") || url.includes("/pdf/")) {
        pdfUrls.add(url);
      }
    });

    // Vai direttamente alla pagina del volantino CON RETRY
    await withRetry(
      async () => {
        await page.goto(
          "https://www.eurospin.it/volantino-store-eurospin/?codice_pv=540690",
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
      await page.waitForSelector("#iubenda-cs-banner", {
        state: "visible",
        timeout: 5000,
      });

      const acceptButtons = [
        "button.iubenda-cs-accept-btn",
        "button.iubenda-cs-btn-primary",
        "#iubenda-cs-banner .iubenda-cs-btn-primary",
        'button[data-action="accept-all"]',
        'button[data-action="accept-necessary"]',
        'button:has-text("Accetta")',
        'button:has-text("Accetta tutti")',
      ];

      for (const selector of acceptButtons) {
        const button = await page.$(selector);
        if (button) {
          await button.click();
          await delay(1000);
          break;
        }
      }

      if (await page.$("#iubenda-cs-banner")) {
        await page.evaluate(() => {
          const banner = document.querySelector("#iubenda-cs-banner");
          if (banner) {
            const buttons = banner.querySelectorAll("button");
            for (const button of buttons) {
              const text = button.textContent.toLowerCase();
              if (
                text.includes("accetta") ||
                text.includes("accept") ||
                text.includes("continua") ||
                text.includes("ok")
              ) {
                button.click();
                return;
              }
            }
            if (buttons.length > 0) buttons[0].click();
          }
        });
        await delay(1000);
      }
    } catch (e) {
      // Banner cookie non trovato o già gestito
      console.log("Banner cookie non trovato o già gestito");
    }

    // Attendi un po' per essere sicuri che la pagina sia caricata
    await delay(3000);

    // Cerca l'iframe e interagisci con esso
    const iframeSelector = "iframe.sn_iframe_volantino";
    await page.waitForSelector(iframeSelector, { timeout: 10000 }).catch(() => {
      console.log("iFrame specifico non trovato, cercando alternative...");
    });

    let frameHandle = await page.$(iframeSelector);

    // Se non troviamo l'iframe specifico, cerchiamo qualsiasi iframe
    if (!frameHandle) {
      const allIframes = await page.$$("iframe");
      if (allIframes.length > 0) {
        frameHandle = allIframes[0];
        console.log("Utilizzando iframe generico");
      }
    }

    let pdfUrl = null;

    // Se abbiamo trovato un iframe, tentiamo di accedere al suo contenuto
    if (frameHandle) {
      const frame = await frameHandle.contentFrame();

      if (frame) {
        // Attendiamo che il contenuto dell'iframe si carichi completamente
        await delay(5000);

        // Cerca pulsanti di download all'interno dell'iframe
        const downloadButton = await frame.$(
          'button[title="Scarica il volantino"], button.download-button, button:has-text("Scarica"), button:has-text("Download")'
        );

        if (downloadButton) {
          console.log("Pulsante di download trovato nell'iframe");
          // Clicchiamo il pulsante per attivare il download
          await downloadButton.click();
          await delay(3000);
        } else {
          // Cerca elementi con icona di download nell'iframe
          try {
            const downloadIcon = await frame.$(
              '.material-symbols-outlined:has-text("download"), .icon-download, [class*="download"]'
            );
            if (downloadIcon) {
              console.log("Icona di download trovata nell'iframe");
              const clickableParent = await downloadIcon.evaluateHandle(
                (node) => {
                  // Risali fino a trovare un elemento cliccabile
                  let el = node;
                  while (el && el.tagName !== "BODY") {
                    if (el.tagName === "BUTTON" || el.tagName === "A")
                      return el;
                    el = el.parentElement;
                  }
                  return null;
                }
              );

              if (clickableParent) {
                await clickableParent.click();
                await delay(3000);
              }
            }
          } catch (e) {
            console.log(
              "Errore nella ricerca dell'icona di download:",
              e.message
            );
          }
        }
      }
    }

    // Controlla se abbiamo trovato URL PDF attraverso l'intercettazione delle richieste
    if (pdfUrls.size > 0) {
      pdfUrl = Array.from(pdfUrls)[0]; // Prendiamo il primo URL PDF trovato
      console.log("URL PDF trovato tramite intercettazione:", pdfUrl);
    }

    if (!pdfUrl) {
      throw new Error("Non è stato possibile trovare il PDF del volantino");
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
        const tempFileName = `eurospin_volantino_${Date.now()}.pdf`;
        const tempFilePath = path.join(tempDir, tempFileName);

        fs.writeFileSync(tempFilePath, Buffer.from(buffer));
        console.log("PDF scaricato temporaneamente:", tempFilePath);

        // Converti il PDF in immagini (sempre nella directory temporanea)
        console.log("Conversione del PDF in immagini...");
        const imageFiles = await convertPdfToImages(tempFilePath, tempDir);

        // Se la conversione ha avuto successo, analizza le immagini
        if (imageFiles.length > 0) {
          console.log("Analisi delle immagini dei prodotti...");
          const productsAnalysis = await processProductImages(
            imageFiles,
            "eurospin"
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
          `${process.env.API_BASE_URL}/api/offers/batch`,
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
    console.error("Errore nello scraping di Eurospin:", error);
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
        // Elimina tutti i file nella directory temporanea
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        // Elimina la directory temporanea
        fs.rmdirSync(tempDir);
        console.log("Directory temporanea eliminata:", tempDir);
      } catch (error) {
        console.error("Errore durante la pulizia dei file temporanei:", error);
      }
    }
  }
};

export default eurospinScraper;
