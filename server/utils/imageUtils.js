import fs from "fs";

/**
 * Converte un'immagine in base64
 * @param {string} imagePath - Percorso dell'immagine
 * @returns {Promise<string|null>} - Stringa base64 o null in caso di errore
 */
async function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    console.error(`Errore nella conversione dell'immagine in base64: ${error}`);
    return null;
  }
}

export { imageToBase64 };
