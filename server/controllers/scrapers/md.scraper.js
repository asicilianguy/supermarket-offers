// Controller per lo scraping di MD
import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { DOWNLOAD_DIR } from "../../config/config.js";
import { processProductImages } from "../../services/aiService.js";
import { delay, withRetry } from "../../utils/browserUtils.js";
import { convertPdfToImages } from "../../utils/pdfUtils.js";

const mdScraper = async (req, res) => {
  let browser;
  try {
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

    // Vai direttamente alla pagina del volantino CON RETRY
    await withRetry(
      async () => {
        await page.goto(
          "https://www.mdspa.it/punti-vendita/Sicilia/AG-Agrigento/516-FAVARA/",
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
    let baseDomain = "https://www.mdspa.it";

    // Primo approccio: cerchiamo il link specifico elementor-button con il testo "Scarica volantino"
    try {
      // Attendi che il selettore sia visibile, con un timeout ragionevole
      await page
        .waitForSelector('a.elementor-button:has-text("Scarica volantino")', {
          timeout: 5000,
        })
        .catch(() => {
          console.log("Link elementor-button non trovato immediatamente");
        });

      // Cerca il link con la classe e il testo specifico
      const downloadButton = await page.$(
        'a.elementor-button:has-text("Scarica volantino")'
      );

      if (downloadButton) {
        const relativeUrl = await downloadButton.getAttribute("href");
        // Controlla se l'URL è relativo o assoluto
        if (relativeUrl.startsWith("http")) {
          pdfUrl = relativeUrl;
        } else {
          pdfUrl =
            baseDomain + (relativeUrl.startsWith("/") ? "" : "/") + relativeUrl;
        }
        console.log("Link trovato con il selettore elementor-button:", pdfUrl);
      }
    } catch (e) {
      console.log("Errore nel primo approccio:", e.message);
    }

    // Secondo approccio: cerca qualsiasi link con icona di download o testo indicativo
    if (!pdfUrl) {
      try {
        const downloadSelectors = [
          "a:has(.fa-download)",
          "a:has(.fas.fa-download)",
          'a:has([class*="download"])',
          "a.elementor-button",
          'a:has-text("volantino")',
          'a:has-text("Volantino")',
        ];

        for (const selector of downloadSelectors) {
          try {
            const link = await page.$(selector);
            if (link) {
              const relativeUrl = await link.getAttribute("href");
              // Controlla se l'URL è relativo o assoluto
              if (relativeUrl.startsWith("http")) {
                pdfUrl = relativeUrl;
              } else {
                pdfUrl =
                  baseDomain +
                  (relativeUrl.startsWith("/") ? "" : "/") +
                  relativeUrl;
              }
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
      throw new Error("Non è stato possibile trovare il link al volantino PDF");
    }

    const results = [];

    // Download del PDF
    await withRetry(
      async () => {
        console.log("Tentativo di download del PDF da:", pdfUrl);

        // Scarica il PDF direttamente
        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok)
          throw new Error(`HTTP error! status: ${pdfResponse.status}`);

        const buffer = await pdfResponse.arrayBuffer();

        const fileName = `md_volantino_${Date.now()}.pdf`;
        const filePath = path.join(DOWNLOAD_DIR, fileName);

        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log("PDF scaricato con successo:", filePath);

        // Converti il PDF in immagini
        console.log("Conversione del PDF in immagini...");
        const imageFiles = await convertPdfToImages(filePath, DOWNLOAD_DIR);

        // Se la conversione ha avuto successo, aggiungi i percorsi delle immagini
        if (imageFiles.length > 0) {
          // Analizza le immagini e ottieni informazioni sui prodotti
          console.log("Analisi delle immagini dei prodotti...");

          const productsAnalysis = await processProductImages(imageFiles, "MD");

          results.push({
            storeName: "MD", // Aggiunto campo richiesto dal frontend
            address: "Italia", // Aggiunto campo richiesto dal frontend
            flyerUrl:
              "https://www.mdspa.it/punti-vendita/Sicilia/AG-Agrigento/516-FAVARA/",
            pdfPath: `/downloads/${fileName}`,
            imagesPaths: imageFiles.map(
              (imgPath) => `/downloads/${path.basename(imgPath)}`
            ),
            productsInfo: productsAnalysis,
          });
        } else {
          // Fallback al PDF se la conversione fallisce
          results.push({
            storeName: "MD", // Aggiunto campo richiesto dal frontend
            address: "Italia", // Aggiunto campo richiesto dal frontend
            flyerUrl:
              "https://www.mdspa.it/punti-vendita/Sicilia/AG-Agrigento/516-FAVARA/",
            pdfPath: `/downloads/${fileName}`,
          });
        }
      },
      3,
      3000
    );

    res.json({
      success: true,
      message: `Volantino scaricato con successo`,
      flyers: results,
    });
  } catch (error) {
    console.error("Errore nello scraping di MD:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default mdScraper;
