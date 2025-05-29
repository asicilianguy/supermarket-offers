// Controller per lo scraping di Lidl
import fs from "fs";
import path from "path";
import os from "os";
import { chromium } from "playwright";
import { processProductImages } from "../../services/aiService.js";
import { delay, withRetry } from "../../utils/browserUtils.js";
import { convertPdfToImages } from "../../utils/pdfUtils.js";
import fetch from "node-fetch";

const lidlScraper = async (req, res) => {
  // Get optional parameter to determine which flyer types to scrape
  // Options: "weekly", "special", or undefined (both)
  const { flyerType } = req.body;

  let browser;
  let tempDir = null;

  try {
    // Crea una directory temporanea invece di usare DOWNLOAD_DIR
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lidl-scraper-"));
    console.log(`Starting Lidl scraping for flyer type: ${flyerType || "all"}`);

    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ["--disable-features=site-per-process"], // This can help with iframe handling
    });

    // Create context with realistic settings
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      acceptDownloads: true,
      navigationTimeout: 60000,
    });

    // Create a page
    const page = await context.newPage();

    // Navigate to Lidl flyers page with retry
    await withRetry(
      async () => {
        await page.goto(
          "https://www.lidl.it/c/volantino-lidl/s10018048?ar=70100",
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

    // Handle cookie banner with a simpler approach
    try {
      // Try to find and click accept button
      await page
        .click("#onetrust-accept-btn-handler", { timeout: 5000 })
        .catch(() => {});

      // Wait a moment and remove any overlays that might be blocking interaction
      await delay(1000);
      await page.evaluate(() => {
        const overlays = document.querySelectorAll(
          ".onetrust-pc-dark-filter, #onetrust-consent-sdk, #onetrust-banner-sdk"
        );
        overlays.forEach((overlay) => {
          if (overlay) overlay.remove();
        });
      });
    } catch (e) {
      console.log("Cookie handling error:", e.message);
    }

    // Determine which sections to scrape based on flyerType
    const sectionsToScrape = [];

    if (!flyerType || flyerType === "weekly") {
      sectionsToScrape.push({
        name: "Volantini settimanali",
        selector:
          "h2.section-head:has-text('Volantini settimanali') + div.subcategory",
      });
    }

    if (!flyerType || flyerType === "special") {
      sectionsToScrape.push({
        name: "Volantini speciali",
        selector:
          "h2.section-head:has-text('Volantini speciali') + div.subcategory",
      });
    }

    const allResults = [];
    let totalProductsInserted = 0;

    // Process each section
    for (const section of sectionsToScrape) {
      console.log(`Processing section: ${section.name}`);

      // Find all flyer links in this section
      const flyerLinks = await page.$$(`${section.selector} a.flyer`);

      console.log(
        `Found ${flyerLinks.length} flyers in section ${section.name}`
      );

      // Process only the first flyer in each section to avoid too many requests
      if (flyerLinks.length > 0) {
        // For each flyer, get the link URL and flyer details
        for (let i = 0; i < Math.min(flyerLinks.length, 1); i++) {
          const flyer = flyerLinks[i];

          // Extract flyer info
          const flyerName = await flyer
            .$eval(".flyer__name", (el) => el.textContent.trim())
            .catch(() => "Volantino Lidl");
          const flyerTitle = await flyer
            .$eval(".flyer__title", (el) => el.textContent.trim())
            .catch(() => section.name);
          const flyerUrl = await flyer.getAttribute("href");

          console.log(`Processing flyer: ${flyerName} - ${flyerTitle}`);

          // Use a direct approach: navigate to the flyer URL in a new tab
          const flyerPage = await context.newPage();

          try {
            await flyerPage.goto(flyerUrl, {
              waitUntil: "domcontentloaded",
              timeout: 60000,
            });
            console.log("Navigated to flyer page");

            // Wait for page to stabilize
            await delay(3000);

            // Handle cookie banner on this page too
            try {
              await flyerPage
                .click("#onetrust-accept-btn-handler", { timeout: 5000 })
                .catch(() => {});
              await delay(1000);
              await flyerPage.evaluate(() => {
                const overlays = document.querySelectorAll(
                  ".onetrust-pc-dark-filter, #onetrust-consent-sdk, #onetrust-banner-sdk"
                );
                overlays.forEach((overlay) => {
                  if (overlay) overlay.remove();
                });
              });
            } catch (e) {
              console.log("Cookie handling error on flyer page:", e.message);
            }

            // Direct method: extract the PDF URL from the network requests
            let pdfUrl = null;

            // Listen for PDF requests
            flyerPage.on("request", (request) => {
              const url = request.url();
              if (
                url.includes(".pdf") &&
                url.includes("object.storage.eu01.onstackit.cloud")
              ) {
                console.log(`Caught PDF request: ${url}`);
                pdfUrl = url;
              }
            });

            // Try to find and click the "Scarica il PDF" button in the sidebar
            console.log("Attempting to click menu button");

            // Method 1: Try to directly find the PDF link without clicking menu
            const directPdfLink = await flyerPage
              .$('a[href*=".pdf"]')
              .catch(() => null);
            if (directPdfLink) {
              pdfUrl = await directPdfLink.getAttribute("href");
              console.log(`Found direct PDF link: ${pdfUrl}`);
            }

            // Method 2: Try to extract PDF URL from page source
            if (!pdfUrl) {
              console.log("Extracting PDF URL from page source");
              const content = await flyerPage.content();
              const pdfRegex = /https:\/\/[^"']+\.pdf/g;
              const matches = content.match(pdfRegex);

              if (matches && matches.length > 0) {
                // Filter for object.storage URLs
                const storageUrls = matches.filter(
                  (url) =>
                    url.includes("object.storage.eu01.onstackit.cloud") ||
                    url.includes("leaflets")
                );

                if (storageUrls.length > 0) {
                  pdfUrl = storageUrls[0];
                  console.log(`Found PDF URL in page source: ${pdfUrl}`);
                }
              }
            }

            // Method 3: Try to click menu button and find download link
            if (!pdfUrl) {
              try {
                // First remove any overlays that might be blocking the menu button
                await flyerPage.evaluate(() => {
                  const overlays = document.querySelectorAll(
                    ".onetrust-pc-dark-filter, .ot-fade-in"
                  );
                  overlays.forEach((overlay) => {
                    if (overlay) overlay.remove();
                  });
                });

                // Use JavaScript to click the menu button
                await flyerPage.evaluate(() => {
                  const menuButtons = Array.from(
                    document.querySelectorAll("button")
                  );
                  const menuButton = menuButtons.find(
                    (btn) =>
                      btn.getAttribute("aria-label") === "Menù" ||
                      btn.textContent.includes("Menù")
                  );

                  if (menuButton) menuButton.click();
                });

                await delay(2000);

                // Look for the download button in the sidebar
                const downloadButton = await flyerPage
                  .$('a[href*=".pdf"]')
                  .catch(() => null);
                if (downloadButton) {
                  pdfUrl = await downloadButton.getAttribute("href");
                  console.log(
                    `Found PDF download link after clicking menu: ${pdfUrl}`
                  );
                }
              } catch (e) {
                console.log("Error trying to access menu:", e.message);
              }
            }

            // If we found a PDF URL, download it
            if (pdfUrl) {
              let flyerResult = {
                storeName: "LIDL",
                address: "Italia",
                flyerName: flyerName,
                flyerTitle: flyerTitle,
                flyerUrl: flyerUrl,
                productsInfo: [],
                batchResults: [],
              };

              try {
                console.log(`Downloading PDF from ${pdfUrl}`);

                // Download PDF with retry
                await withRetry(
                  async () => {
                    // Scarica il PDF direttamente
                    const pdfResponse = await fetch(pdfUrl, {
                      headers: {
                        "User-Agent":
                          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                        Referer: flyerUrl,
                      },
                    });

                    if (!pdfResponse.ok) {
                      throw new Error(
                        `HTTP error! status: ${pdfResponse.status}`
                      );
                    }

                    const buffer = await pdfResponse.arrayBuffer();

                    // Salva temporaneamente il PDF nella directory temporanea
                    const tempFileName = `lidl_${section.name
                      .replace(/[^a-z0-9]/gi, "_")
                      .toLowerCase()}_${Date.now()}.pdf`;
                    const tempFilePath = path.join(tempDir, tempFileName);

                    fs.writeFileSync(tempFilePath, Buffer.from(buffer));
                    console.log("PDF scaricato temporaneamente:", tempFilePath);

                    // Converti il PDF in immagini (sempre nella directory temporanea)
                    console.log("Conversione del PDF in immagini...");
                    const imageFiles = await convertPdfToImages(
                      tempFilePath,
                      tempDir
                    );

                    // Se la conversione ha avuto successo, analizza le immagini
                    if (imageFiles.length > 0) {
                      console.log("Analisi delle immagini dei prodotti...");
                      const productsAnalysis = await processProductImages(
                        imageFiles,
                        "lidl"
                      );

                      // Elabora i risultati dell'analisi e prepara l'array dei prodotti
                      let productsInfo = [];

                      for (const pageResult of productsAnalysis) {
                        if (Array.isArray(pageResult.productInfo)) {
                          // Se productInfo è già un array
                          productsInfo = [
                            ...productsInfo,
                            ...pageResult.productInfo,
                          ];
                        } else if (
                          typeof pageResult.productInfo === "object" &&
                          pageResult.productInfo !== null
                        ) {
                          // Se è un singolo oggetto prodotto
                          productsInfo.push(pageResult.productInfo);
                        }
                      }

                      // Aggiorna il risultato con le informazioni sui prodotti
                      flyerResult.productsInfo = productsInfo;

                      // Esegui il batch per questo singolo PDF subito dopo l'analisi
                      if (productsInfo.length > 0) {
                        try {
                          console.log(
                            `Invio di ${productsInfo.length} prodotti all'endpoint batch...`
                          );

                          const batchResponse = await fetch(
                            `${process.env.API_BASE_URL}/api/offers/batch`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                productsInfo: productsInfo,
                              }),
                            }
                          );

                          const batchResult = await batchResponse.json();
                          flyerResult.batchResults.push(batchResult);

                          if (batchResult.success) {
                            totalProductsInserted +=
                              batchResult.insertedCount || 0;
                            console.log(
                              `Batch completato con successo. Inseriti ${batchResult.insertedCount} prodotti.`
                            );
                          } else {
                            console.log(
                              `Batch completato con errori: ${batchResult.message}`
                            );
                          }
                        } catch (batchError) {
                          console.error(
                            "Errore nell'invio dei prodotti all'endpoint batch:",
                            batchError
                          );
                          flyerResult.batchError = batchError.message;
                        }
                      }
                    }
                  },
                  3,
                  3000
                );

                // Aggiungi i risultati di questo volantino all'elenco generale
                allResults.push(flyerResult);
              } catch (downloadError) {
                console.error(
                  `Error downloading PDF: ${downloadError.message}`
                );
                // Aggiungi comunque il risultato parziale
                allResults.push(flyerResult);
              }
            } else {
              console.log(`Could not find PDF URL for flyer: ${flyerName}`);
            }
          } catch (navigateError) {
            console.error(
              `Error navigating to flyer page: ${navigateError.message}`
            );
          } finally {
            // Close the flyer page
            await flyerPage.close();
          }
        }
      }
    }

    // Return results
    res.json({
      success: true,
      message: `Scraped ${allResults.length} Lidl flyers successfully. Inserted ${totalProductsInserted} products in total.`,
      flyers: allResults,
    });
  } catch (error) {
    console.error("Error scraping Lidl flyers:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
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

export default lidlScraper;
