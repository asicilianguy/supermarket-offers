import express from "express";
import fs from "fs";
import path from "path";
import os from "os";
import { chromium } from "playwright";
import { delay, withRetry } from "../../utils/browserUtils.js";
import { convertPdfToImages } from "../../utils/pdfUtils.js";
import { processProductImages } from "../../services/aiService.js";
import fetch from "node-fetch";

const router = express.Router();

// Definizione della route per lo scraping di PaghiPoco
const paghipocoScraper = async (req, res) => {
  let browser;
  let tempDir = null;

  try {
    // Crea una directory temporanea
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "paghipoco-scraper-"));

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

    // Vai alla pagina del volantino CON RETRY
    await withRetry(
      async () => {
        console.log("Navigando alla pagina principale di PaghiPoco...");
        await page.goto("https://paghipoco.com/volantino-e-offerte/", {
          waitUntil: "domcontentloaded",
          timeout: 45000,
        });
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
      console.log("Gestione banner cookie...");
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
        "#CybotCookiebotDialog",
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
            "#CybotCookiebotDialogBodyLevelButtonAccept",
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

    // Ottieni l'URL dell'iframe
    console.log("Cercando l'iframe del volantino...");
    let iframeUrl = null;

    try {
      iframeUrl = await page.$eval(
        'iframe[title="View"]',
        (iframe) => iframe.src
      );
      console.log("URL dell'iframe trovato:", iframeUrl);
    } catch (e) {
      console.log(
        "Iframe non trovato direttamente, cercando con altri metodi..."
      );

      // Se l'iframe ha src vuoto, cerchiamo di trovare il suo URL in altro modo
      try {
        // Cerca l'URL del volantino nella pagina
        const possibleUrls = await page.evaluate(() => {
          // Cerca nei data attributes, script, o altre fonti
          const scripts = Array.from(document.querySelectorAll("script"));
          const jsonData = [];

          // Estrarre dati JSON da script
          scripts.forEach((script) => {
            try {
              if (
                script.textContent.includes("volantino") ||
                script.textContent.includes("flyer")
              ) {
                jsonData.push(script.textContent);
              }
            } catch (e) {}
          });

          // Cerca URL che potrebbero contenere "viewer" o "flyer"
          const links = Array.from(
            document.querySelectorAll(
              'a[href*="viewer"], a[href*="flyer"], a[href*="volantino"]'
            )
          );
          return {
            linkUrls: links.map((link) => link.href),
            scriptData: jsonData,
          };
        });

        console.log("Possibili URL trovati:", possibleUrls.linkUrls);

        // Se troviamo URL nei link, usa il primo
        if (possibleUrls.linkUrls && possibleUrls.linkUrls.length > 0) {
          iframeUrl = possibleUrls.linkUrls[0];
        } else {
          // Se l'URL è ancora vuoto, possiamo usare un URL di fallback
          iframeUrl = "https://viewer.ipaper.io";
        }
      } catch (err) {
        console.log(
          "Errore nella ricerca alternativa dell'URL dell'iframe:",
          err.message
        );
      }
    }

    // Se non abbiamo trovato un URL valido per l'iframe, esci
    if (!iframeUrl) {
      throw new Error("Impossibile trovare l'URL dell'iframe del volantino");
    }

    console.log("Navigando all'iframe:", iframeUrl);

    // Apri una nuova pagina con l'URL dell'iframe
    const iframePage = await context.newPage();
    await iframePage.goto(iframeUrl, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Attendi che la pagina dell'iframe sia completamente caricata
    await delay(5000);

    // Troviamo e clicchiamo sul pulsante del menu (tre puntini)
    console.log("Cercando il pulsante del menu...");

    // Prova diversi selettori per il pulsante del menu
    const menuButtonSelectors = [
      "a.cmd.menu-toggle",
      "a.menu-toggle",
      'a[title="More"]',
      "a:has(.fa-ellipsis-h)",
      "button:has(.fa-ellipsis-h)",
      ".menu-toggle",
      ".cmd.menu-toggle",
    ];

    let menuButtonFound = false;

    for (const selector of menuButtonSelectors) {
      try {
        const isVisible = await iframePage.isVisible(selector);
        if (isVisible) {
          console.log(`Pulsante menu trovato con selettore: ${selector}`);
          await iframePage.click(selector);
          menuButtonFound = true;
          // Attendi che il menu si apra
          await delay(1000);
          break;
        }
      } catch (e) {
        console.log(`Selettore ${selector} non trovato:`, e.message);
      }
    }

    if (!menuButtonFound) {
      console.log(
        "Pulsante del menu non trovato, tentativo di approccio alternativo..."
      );

      // Se non troviamo il pulsante del menu, proviamo a cercare direttamente il pulsante di download
      const downloadSelectors = [
        "a.cmd.cmdSave",
        "a:has(.fa-download)",
        'a[title="Download"]',
        "button:has(.fa-download)",
        ".cmdSave",
        '[data-action="download"]',
        'a:has-text("Download")',
        'button:has-text("Download")',
      ];

      for (const selector of downloadSelectors) {
        try {
          const isVisible = await iframePage.isVisible(selector);
          if (isVisible) {
            console.log(
              `Pulsante download trovato direttamente con selettore: ${selector}`
            );
            await iframePage.click(selector);
            // Attendi il popup di download
            await delay(2000);
            menuButtonFound = true; // Abbiamo trovato direttamente il download
            break;
          }
        } catch (e) {
          console.log(`Selettore download ${selector} non trovato:`, e.message);
        }
      }
    } else {
      // Se abbiamo trovato il pulsante del menu, cerchiamo ora il pulsante di download nel menu
      console.log("Cercando il pulsante di download nel menu...");

      const downloadSelectors = [
        "a.cmd.cmdSave",
        "a.cmdSave",
        "a:has(.fa-download)",
        'a[title="Download"]',
        'li a:has-text("Download")',
        ".v-menu a:has(.fa-download)",
        '.v-menu li:has-text("Download") a',
      ];

      let downloadButtonFound = false;

      for (const selector of downloadSelectors) {
        try {
          const isVisible = await iframePage.isVisible(selector);
          if (isVisible) {
            console.log(`Pulsante download trovato con selettore: ${selector}`);
            await iframePage.click(selector);
            downloadButtonFound = true;
            // Attendi il popup di download
            await delay(2000);
            break;
          }
        } catch (e) {
          console.log(`Selettore download ${selector} non trovato:`, e.message);
        }
      }

      if (!downloadButtonFound) {
        console.log("Pulsante download non trovato nel menu");
      }
    }

    // Cerca il link del PDF nei file scaricati o nella pagina
    console.log("Cercando il link di download del PDF...");

    // Monitoraggio dei download
    let pdfPath = null;

    // Configura il monitoraggio dei download
    const downloadPromise = iframePage
      .waitForEvent("download", { timeout: 30000 })
      .catch((e) => {
        console.log("Timeout di attesa download:", e.message);
        return null;
      });

    // Alternativa: cerca il link di download diretto nella pagina
    let pdfUrl = null;

    try {
      // Cerca link PDF visibili nella pagina
      pdfUrl = await iframePage.evaluate(() => {
        // Cerca elementi che potrebbero contenere link al PDF
        const pdfLinks = Array.from(
          document.querySelectorAll(
            'a[href$=".pdf"], a[href*=".pdf"], [data-url$=".pdf"], [data-url*=".pdf"], [data-href$=".pdf"], [data-href*=".pdf"]'
          )
        );

        // FIX: Invece di usare il selettore invalido *[data-*], seleziona tutti gli elementi
        // e filtra quelli con attributi data-
        const allElements = Array.from(document.querySelectorAll("*"));
        const elementsWithDataAttrs = allElements.filter((el) => {
          for (const attr of el.attributes) {
            if (attr.name.startsWith("data-")) {
              return true;
            }
          }
          return false;
        });

        for (const el of elementsWithDataAttrs) {
          const attributes = el.attributes;
          for (const attr of attributes) {
            if (
              attr.name.startsWith("data-") &&
              typeof attr.value === "string" &&
              (attr.value.includes(".pdf") || attr.value.includes("/pdf"))
            ) {
              pdfLinks.push({
                href: attr.value,
                dataAttribute: attr.name,
              });
            }
          }
        }

        // Controlla anche le richieste di rete
        let foundInRequests = null;
        if (window.performance && window.performance.getEntries) {
          const entries = window.performance.getEntries();
          for (const entry of entries) {
            if (
              entry.name &&
              (entry.name.endsWith(".pdf") || entry.name.includes("/pdf"))
            ) {
              foundInRequests = entry.name;
              break;
            }
          }
        }

        return {
          links: pdfLinks.map((link) =>
            typeof link === "object" && link.href ? link.href : link
          ),
          networkRequest: foundInRequests,
        };
      });

      console.log("Risultati della ricerca PDF nella pagina:", pdfUrl);

      // Usa il primo link trovato
      if (pdfUrl.links && pdfUrl.links.length > 0) {
        pdfUrl = pdfUrl.links[0];
      } else if (pdfUrl.networkRequest) {
        pdfUrl = pdfUrl.networkRequest;
      } else {
        pdfUrl = null;
      }

      if (pdfUrl) {
        console.log("URL del PDF trovato nella pagina:", pdfUrl);
      }
    } catch (e) {
      console.log("Errore nella ricerca del link PDF:", e.message);
    }

    // Attendi il download o usa l'URL trovato
    const download = await downloadPromise;

    let allProductsInfo = [];

    if (download) {
      console.log("Download rilevato!");

      // Salva il file scaricato in una directory temporanea
      const tempFileName = `paghipoco_volantino_${Date.now()}.pdf`;
      const tempFilePath = path.join(tempDir, tempFileName);

      await download.saveAs(tempFilePath);
      console.log("File scaricato salvato temporaneamente in:", tempFilePath);

      pdfPath = tempFilePath;

      // Procedi con la conversione del PDF in immagini
      console.log("Conversione del PDF in immagini...");
      const imageFiles = await convertPdfToImages(pdfPath, tempDir);

      // Se la conversione ha avuto successo, analizza le immagini
      if (imageFiles && imageFiles.length > 0) {
        // Analizza le immagini e ottieni informazioni sui prodotti
        console.log("Analisi delle immagini dei prodotti...");
        const productsAnalysis = await processProductImages(
          imageFiles,
          "paghipoco"
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
    } else if (pdfUrl) {
      // Se non abbiamo catturato un download ma abbiamo un URL, proviamo a scaricarlo direttamente
      console.log("Download manuale dall'URL:", pdfUrl);

      try {
        // Scarica il PDF direttamente
        const pdfResponse = await fetch(pdfUrl);
        if (!pdfResponse.ok)
          throw new Error(`HTTP error! status: ${pdfResponse.status}`);

        const buffer = await pdfResponse.arrayBuffer();

        // Crea un nome file unico con timestamp nella directory temporanea
        const tempFileName = `paghipoco_volantino_${Date.now()}.pdf`;
        const tempFilePath = path.join(tempDir, tempFileName);

        fs.writeFileSync(tempFilePath, Buffer.from(buffer));
        console.log("PDF scaricato temporaneamente:", tempFilePath);

        pdfPath = tempFilePath;

        // Converti il PDF in immagini
        console.log("Conversione del PDF in immagini...");
        const imageFiles = await convertPdfToImages(pdfPath, tempDir);

        // Se la conversione ha avuto successo, analizza le immagini
        if (imageFiles && imageFiles.length > 0) {
          // Analizza le immagini e ottieni informazioni sui prodotti
          console.log("Analisi delle immagini dei prodotti...");
          const productsAnalysis = await processProductImages(
            imageFiles,
            "PaghiPoco"
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
      } catch (downloadError) {
        console.error(
          "Errore nel download manuale del PDF:",
          downloadError.message
        );
      }
    }

    // Se non abbiamo trovato il PDF, cerchiamo di fare uno screenshot come fallback
    if (!pdfPath || allProductsInfo.length === 0) {
      console.log(
        "PDF non trovato o non analizzabile, acquisizione screenshot come fallback..."
      );

      // Crea una directory per gli screenshot all'interno della directory temporanea
      const screenshotDir = path.join(tempDir, "screenshots");
      fs.mkdirSync(screenshotDir, { recursive: true });

      // Tenta di acquisire più pagine se possibile
      const screenshotPaths = [];

      // Prima pagina
      const firstScreenshotPath = path.join(screenshotDir, "page_1.png");
      await iframePage.screenshot({
        path: firstScreenshotPath,
        fullPage: true,
      });
      screenshotPaths.push(firstScreenshotPath);

      // Cerca i pulsanti di navigazione per acquisire altre pagine
      const hasNextButton = await iframePage.evaluate(() => {
        const nextButtons = document.querySelectorAll(
          'a.cmd.cmdNext, .cmdNext, a:has(.fa-chevron-right), [title="Next page"]'
        );
        return nextButtons.length > 0;
      });

      if (hasNextButton) {
        // Prova a catturare più pagine
        for (let pageNum = 2; pageNum <= 20; pageNum++) {
          try {
            // Clicca sul pulsante "Next"
            await iframePage.click(
              'a.cmd.cmdNext, .cmdNext, a:has(.fa-chevron-right), [title="Next page"]'
            );

            // Attendi il caricamento della pagina
            await delay(1500);

            // Screenshot
            const screenshotPath = path.join(
              screenshotDir,
              `page_${pageNum}.png`
            );
            await iframePage.screenshot({
              path: screenshotPath,
              fullPage: true,
            });
            screenshotPaths.push(screenshotPath);

            console.log(`Screenshot pagina ${pageNum} acquisito`);
          } catch (e) {
            console.log(
              `Impossibile acquisire altre pagine dopo la ${pageNum - 1}:`,
              e.message
            );
            break;
          }
        }
      }

      console.log(
        `Acquisiti ${screenshotPaths.length} screenshot come fallback`
      );

      // Elabora gli screenshot con l'AI
      if (screenshotPaths.length > 0) {
        const productsAnalysis = await processProductImages(
          screenshotPaths,
          "PaghiPoco"
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
    }

    // Se non abbiamo né un PDF né gli screenshot o nessun prodotto è stato trovato, restituisci un errore
    if (allProductsInfo.length === 0) {
      throw new Error("Impossibile estrarre prodotti dal volantino");
    }

    // Invia i prodotti all'endpoint batch
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
  } catch (error) {
    console.error("Errore nello scraping di PaghiPoco:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Errore sconosciuto",
    });
  } finally {
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

export default paghipocoScraper;
