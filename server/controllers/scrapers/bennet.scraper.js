import fs from "fs";
import path from "path";
import os from "os";
import { convertPdfToImages } from "../../utils/pdfUtils.js";
import { processProductImages } from "../../services/aiService.js";
import fetch from "node-fetch";

const bennetScraper = async (req, res) => {
  // Get optional parameter to determine which flyers to download
  // Format: [0,2,3] to download specific flyers by index
  // If not provided, download all known flyers
  const { flyerIndices } = req.body;
  let tempDir = null;

  try {
    // Crea una directory temporanea
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bennet-scraper-"));

    console.log(`Starting Bennet scraping using direct API approach`);

    // Define known flyer data - we'll update this periodically
    // These are based on the patterns observed in your examples
    const knownFlyers = [
      {
        id: "3a32145f-9993-4a31-99d7-b12c28c6611c",
        viewerUrl: "https://bennet.volantinopiu.com/volantino2171500.html",
        title: "60° ANNIVERSARIO SOTTOCOSTO 1a parte",
        dateRange: "Dal 22/05 al 04/06",
      },
      {
        id: "d187a6b5-0c0d-421d-91b5-6b4512ce551c",
        viewerUrl: "https://bennet.volantinopiu.com/volantino2167000.html",
        title: "UNA CASA SPLENDENTE",
        dateRange: "Dal 15/05 al 28/05",
      },
      {
        id: "08849a4a-643c-4e2a-9a04-fe70270e95f9",
        viewerUrl: "https://bennet.volantinopiu.com/volantino2142500.html",
        title: "IL BELLO DI STARE ALL'APERTO",
        dateRange: "Dal 22/04 al 28/05",
      },
      {
        id: "65f04f2b-87c1-48d4-bb8a-02788e0dcc49",
        viewerUrl: "https://bennet.volantinopiu.com/volantino2171600.html",
        title: "OFFERTE EXTRA",
        dateRange: "Dal 22/05 al 02/06",
      },
    ];

    // Determine which flyers to process
    let flyersToProcess = [];
    if (
      flyerIndices &&
      Array.isArray(flyerIndices) &&
      flyerIndices.length > 0
    ) {
      // Process only specified flyers
      flyersToProcess = flyerIndices
        .filter((index) => index >= 0 && index < knownFlyers.length)
        .map((index) => ({ flyer: knownFlyers[index], index }));
    } else {
      // Process all flyers
      flyersToProcess = knownFlyers.map((flyer, index) => ({ flyer, index }));
    }

    console.log(`Will process ${flyersToProcess.length} flyers`);

    // Fallback mechanism: If we don't have the IDs or they're outdated,
    // we can try to fetch them from the volantinopiu.com site which might be less protected
    if (flyersToProcess.length === 0) {
      console.log(
        "No known flyers to process. Attempting to fetch current flyers from secondary source..."
      );
      // This would be an implementation to fetch current flyer IDs
      // For now, we'll return an error message
    }

    const flyerResults = [];
    let totalProductsProcessed = 0;
    let totalProductsInserted = 0;

    // Process each selected flyer
    for (const { flyer, index } of flyersToProcess) {
      try {
        console.log(`Processing flyer ${index + 1}: ${flyer.title}`);

        // Construct the PDF URL using the ID
        const pdfUrl = `https://bennet-cdn.thron.com/delivery/public/document/bennet/${flyer.id}/c82oyu/WEB/volantino`;

        console.log(`Attempting to download PDF from: ${pdfUrl}`);

        try {
          // Download the PDF with appropriate headers using native fetch
          const pdfResponse = await fetch(pdfUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
              Referer: "https://bennet.volantinopiu.com/",
              Accept: "application/pdf",
            },
          });

          if (!pdfResponse.ok) {
            throw new Error(`HTTP error! status: ${pdfResponse.status}`);
          }

          const buffer = await pdfResponse.arrayBuffer();

          // Create a unique filename in the temp directory
          const sanitizedTitle = flyer.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
          const tempFileName = `bennet_${sanitizedTitle}_${Date.now()}.pdf`;
          const tempFilePath = path.join(tempDir, tempFileName);

          // Save the PDF temporariamente
          fs.writeFileSync(tempFilePath, Buffer.from(buffer));
          console.log(`PDF downloaded temporarily: ${tempFilePath}`);

          // Convert PDF to images (in temp directory)
          console.log("Converting PDF to images...");
          const imageFiles = await convertPdfToImages(tempFilePath, tempDir);

          // Process the images if conversion was successful
          if (imageFiles.length > 0) {
            console.log("Analyzing product images...");
            const productsAnalysis = await processProductImages(
              imageFiles,
              "bennet"
            );

            // Estrai i prodotti di questo volantino
            let flyerProductsInfo = [];
            for (const pageResult of productsAnalysis) {
              if (Array.isArray(pageResult.productInfo)) {
                // Se productInfo è già un array
                flyerProductsInfo = [
                  ...flyerProductsInfo,
                  ...pageResult.productInfo,
                ];
              } else if (
                typeof pageResult.productInfo === "object" &&
                pageResult.productInfo !== null
              ) {
                // Se è un singolo oggetto prodotto
                flyerProductsInfo.push(pageResult.productInfo);
              }
            }

            totalProductsProcessed += flyerProductsInfo.length;

            // Esegui il batch per questo volantino specifico
            if (flyerProductsInfo.length > 0) {
              try {
                console.log(
                  `Invio di ${flyerProductsInfo.length} prodotti del volantino "${flyer.title}" all'endpoint batch`
                );

                const batchResponse = await fetch(
                  `${
                    process.env.API_BASE_URL || "http://localhost:3001"
                  }/api/offers/batch`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productsInfo: flyerProductsInfo }),
                  }
                );

                const batchResult = await batchResponse.json();

                if (batchResult.success) {
                  totalProductsInserted += batchResult.insertedCount || 0;
                }

                // Aggiungi info sul volantino con il risultato del batch
                flyerResults.push({
                  storeName: "bennet",
                  address: "Italia",
                  flyerName: flyer.title,
                  flyerDateRange: flyer.dateRange,
                  flyerUrl: flyer.viewerUrl,
                  productsFound: flyerProductsInfo.length,
                  productsInserted: batchResult.insertedCount || 0,
                  batchResult,
                });
              } catch (batchError) {
                console.error(
                  `Errore nell'invio dei prodotti del volantino "${flyer.title}" all'endpoint batch:`,
                  batchError
                );

                flyerResults.push({
                  storeName: "bennet",
                  address: "Italia",
                  flyerName: flyer.title,
                  flyerDateRange: flyer.dateRange,
                  flyerUrl: flyer.viewerUrl,
                  productsFound: flyerProductsInfo.length,
                  productsInserted: 0,
                  batchError: batchError.message,
                });
              }
            } else {
              flyerResults.push({
                storeName: "bennet",
                address: "Italia",
                flyerName: flyer.title,
                flyerDateRange: flyer.dateRange,
                flyerUrl: flyer.viewerUrl,
                productsFound: 0,
                message: "Nessun prodotto trovato in questo volantino",
              });
            }
          } else {
            console.log("No images could be extracted from the PDF");
            flyerResults.push({
              storeName: "bennet",
              address: "Italia",
              flyerName: flyer.title,
              flyerDateRange: flyer.dateRange,
              flyerUrl: flyer.viewerUrl,
              error: "Impossibile convertire il PDF in immagini",
            });
          }
        } catch (downloadError) {
          console.error(
            `Error downloading PDF for flyer ${index + 1}:`,
            downloadError
          );

          // Try an alternative URL pattern if the first one fails
          const altPdfUrl = `https://bennet-cdn.thron.com/delivery/public/document/bennet/${flyer.id}/c82oyu/STD/volantino`;
          console.log(`Trying alternative URL: ${altPdfUrl}`);

          try {
            const altPdfResponse = await fetch(altPdfUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                Referer: "https://bennet.volantinopiu.com/",
                Accept: "application/pdf",
              },
            });

            if (!altPdfResponse.ok) {
              throw new Error(`HTTP error! status: ${altPdfResponse.status}`);
            }

            const buffer = await altPdfResponse.arrayBuffer();

            // Create a unique filename in the temp directory
            const sanitizedTitle = flyer.title
              .replace(/[^a-z0-9]/gi, "_")
              .toLowerCase();
            const tempFileName = `bennet_${sanitizedTitle}_${Date.now()}.pdf`;
            const tempFilePath = path.join(tempDir, tempFileName);

            // Save the PDF temporariamente
            fs.writeFileSync(tempFilePath, Buffer.from(buffer));
            console.log(
              `PDF downloaded temporarily with alternative URL: ${tempFilePath}`
            );

            // Convert PDF to images (in temp directory)
            console.log("Converting PDF to images...");
            const imageFiles = await convertPdfToImages(tempFilePath, tempDir);

            // Process the images if conversion was successful
            if (imageFiles.length > 0) {
              console.log("Analyzing product images...");
              const productsAnalysis = await processProductImages(
                imageFiles,
                "bennet"
              );

              // Estrai i prodotti di questo volantino
              let flyerProductsInfo = [];
              for (const pageResult of productsAnalysis) {
                if (Array.isArray(pageResult.productInfo)) {
                  // Se productInfo è già un array
                  flyerProductsInfo = [
                    ...flyerProductsInfo,
                    ...pageResult.productInfo,
                  ];
                } else if (
                  typeof pageResult.productInfo === "object" &&
                  pageResult.productInfo !== null
                ) {
                  // Se è un singolo oggetto prodotto
                  flyerProductsInfo.push(pageResult.productInfo);
                }
              }

              totalProductsProcessed += flyerProductsInfo.length;

              // Esegui il batch per questo volantino specifico
              if (flyerProductsInfo.length > 0) {
                try {
                  console.log(
                    `Invio di ${flyerProductsInfo.length} prodotti del volantino "${flyer.title}" all'endpoint batch`
                  );

                  const batchResponse = await fetch(
                    `${
                      process.env.API_BASE_URL || "http://localhost:3001"
                    }/api/offers/batch`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ productsInfo: flyerProductsInfo }),
                    }
                  );

                  const batchResult = await batchResponse.json();

                  if (batchResult.success) {
                    totalProductsInserted += batchResult.insertedCount || 0;
                  }

                  // Aggiungi info sul volantino con il risultato del batch
                  flyerResults.push({
                    storeName: "bennet",
                    address: "Italia",
                    flyerName: flyer.title,
                    flyerDateRange: flyer.dateRange,
                    flyerUrl: flyer.viewerUrl,
                    productsFound: flyerProductsInfo.length,
                    productsInserted: batchResult.insertedCount || 0,
                    batchResult,
                  });
                } catch (batchError) {
                  console.error(
                    `Errore nell'invio dei prodotti del volantino "${flyer.title}" all'endpoint batch:`,
                    batchError
                  );

                  flyerResults.push({
                    storeName: "bennet",
                    address: "Italia",
                    flyerName: flyer.title,
                    flyerDateRange: flyer.dateRange,
                    flyerUrl: flyer.viewerUrl,
                    productsFound: flyerProductsInfo.length,
                    productsInserted: 0,
                    batchError: batchError.message,
                  });
                }
              } else {
                flyerResults.push({
                  storeName: "bennet",
                  address: "Italia",
                  flyerName: flyer.title,
                  flyerDateRange: flyer.dateRange,
                  flyerUrl: flyer.viewerUrl,
                  productsFound: 0,
                  message: "Nessun prodotto trovato in questo volantino",
                });
              }
            } else {
              console.log("No images could be extracted from the PDF");
              flyerResults.push({
                storeName: "bennet",
                address: "Italia",
                flyerName: flyer.title,
                flyerDateRange: flyer.dateRange,
                flyerUrl: flyer.viewerUrl,
                error: "Impossibile convertire il PDF in immagini",
              });
            }
          } catch (altError) {
            console.error(
              `Alternative URL also failed for flyer ${index + 1}:`,
              altError
            );
            flyerResults.push({
              storeName: "bennet",
              address: "Italia",
              flyerName: flyer.title,
              flyerDateRange: flyer.dateRange,
              flyerUrl: flyer.viewerUrl,
              error: "Impossibile scaricare il PDF (entrambi i metodi falliti)",
            });
          }
        }
      } catch (flyerError) {
        console.error(`Error processing flyer at index ${index}:`, flyerError);
        flyerResults.push({
          storeName: "bennet",
          address: "Italia",
          flyerName: flyer.title,
          flyerDateRange: flyer.dateRange,
          flyerUrl: flyer.viewerUrl,
          error: `Errore nell'elaborazione: ${flyerError.message}`,
        });
      }
    }

    // Restituisci i risultati complessivi
    res.json({
      success: flyerResults.length > 0,
      message: `Elaborati ${flyerResults.length} volantini Bennet, trovati ${totalProductsProcessed} prodotti, inseriti ${totalProductsInserted} prodotti`,
      flyerResults: flyerResults,
    });
  } catch (error) {
    console.error("Error in Bennet flyer processing:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
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

export default bennetScraper;
