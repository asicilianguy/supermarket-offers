import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

/**
 * Converte un file PDF in immagini PNG
 * @param {string} pdfPath - Percorso del file PDF
 * @param {string} outputDir - Directory di output per le immagini
 * @returns {Promise<string[]>} - Array di percorsi delle immagini generate
 */
async function convertPdfToImages(pdfPath, outputDir) {
  const baseName = path.basename(pdfPath, ".pdf");
  const outputPath = path.join(outputDir, baseName);

  try {
    // Verifica che poppler-utils sia installato
    await exec("which pdftoppm");

    // Converti PDF in immagini PNG
    // -png: formato output
    // -r 150: risoluzione 150 DPI
    // -singlefile: genera un'unica immagine per pagina
    await exec(`pdftoppm -png -r 150 "${pdfPath}" "${outputPath}"`);

    // Trova tutte le immagini generate
    const imageFiles = fs
      .readdirSync(outputDir)
      .filter((file) => file.startsWith(baseName) && file.endsWith(".png"))
      .map((file) => path.join(outputDir, file));

    return imageFiles;
  } catch (error) {
    console.error("Errore nella conversione PDF:", error);
    return [];
  }
}

export { convertPdfToImages };
