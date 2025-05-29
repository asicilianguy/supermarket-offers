import path from "path";
import { OpenAI } from "openai";
import { imageToBase64 } from "../utils/imageUtils.js";

// Configurazione OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analizza un'immagine con OpenAI
 * @param {string} base64Image - Immagine in formato base64
 * @param {string|null} storeName - Nome del supermercato
 * @returns {Promise<object>} - Risultato dell'analisi
 */
async function analyzeProductImage(base64Image, storeName = null) {
  try {
    console.log("Invio dell'immagine a OpenAI per l'analisi...");

    // Crea un prompt personalizzato che include le informazioni sul supermercato
    let promptText =
      "Analizza questa immagine di un volantino promozionale e ritorna le seguenti informazioni in formato JSON:";
    promptText += "\n- productName";
    promptText +=
      "\n- productQuantity (se presente) (con l'unità di misura dopo il numero se possibile)";
    promptText += "\n- offerPrice";
    promptText += "\n- previousPrice (se presente)";
    promptText +=
      "\n- discountPercentage (se presente e calcolabile), come numero intero tra 0 e 100";

    // Richiedi di distinguere tra pricePerKg o pricePerLiter a seconda del tipo di prodotto
    promptText +=
      "\n- pricePerKg (solo se è un prodotto solido e il prezzo al kg è indicato)";
    promptText +=
      "\n- pricePerLiter (solo se è un prodotto liquido e il prezzo al litro è indicato)";

    // Richiedi entrambe le date nel formato specifico
    promptText += "\n- offerStartDate (in formato dd-mm-yyyy)";
    promptText += "\n- offerEndDate (in formato dd-mm-yyyy)";

    promptText += "\n- brand (se presente)";
    promptText +=
      "\n- supermarketAisle (basata su una stima intelligente di dove potrebbe essere posizionato questo prodotto)";

    // Aggiungi informazioni sul supermercato se disponibili
    if (storeName) {
      promptText += '\n- chainName: "' + storeName + '"';
    }

    promptText +=
      "\n\nRitorna solo il JSON. Non includere altro testo oltre al JSON.";

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: promptText,
            },
            {
              type: "input_image",
              image_url: `data:image/png;base64,${base64Image}`,
              detail: "high",
            },
          ],
        },
      ],
    });

    console.log("Risposta ricevuta da OpenAI");

    // Estrai il testo dalla risposta
    const responseText =
      response.output.text || response.output_text || JSON.stringify(response);

    // Cerca di estrarre il JSON dalla risposta
    let jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonText = jsonMatch ? jsonMatch[1] : responseText;

    // Rimuovi eventuali caratteri non-JSON all'inizio e alla fine
    jsonText = jsonText.replace(/^[^{\[]+/, "").replace(/[^}\]]+$/, "");

    // Prova a parsare il JSON
    try {
      const parsedJson = JSON.parse(jsonText);

      // Se è presente il campo data_inizio_offerta e data_scadenza_offerta, convertili in Date
      if (parsedJson.offerStartDate) {
        const [day, month, year] = parsedJson.offerStartDate.split("-");
        parsedJson.offerStartDate = new Date(`${year}-${month}-${day}`);
      }

      if (parsedJson.offerEndDate) {
        const [day, month, year] = parsedJson.offerEndDate.split("-");
        parsedJson.offerEndDate = new Date(`${year}-${month}-${day}`);
      }

      return parsedJson;
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
      return {
        error: "Impossibile parsare la risposta come JSON",
        rawText: jsonText,
      };
    }
  } catch (error) {
    console.error(`Errore nell'analisi dell'immagine con OpenAI: ${error}`);
    return { error: error.message };
  }
}

/**
 * Processa un gruppo di immagini per estrarre informazioni sui prodotti
 * @param {string[]} imagesPaths - Array di percorsi di immagini
 * @param {string|null} storeName - Nome del supermercato
 * @returns {Promise<Array>} - Risultati dell'analisi
 */
async function processProductImages(imagesPaths, storeName = null) {
  const results = [];

  console.log(`Elaborazione di ${imagesPaths.length} immagini...`);

  // Processa le immagini una alla volta per evitare di sovraccaricare l'API
  for (const imagePath of imagesPaths) {
    console.log(`Elaborazione dell'immagine: ${imagePath}`);

    // Converti l'immagine in base64
    const base64Image = await imageToBase64(imagePath);

    if (base64Image) {
      // Analizza l'immagine con le informazioni sul supermercato
      const productInfo = await analyzeProductImage(base64Image, storeName);

      results.push({
        imagePath: path.basename(imagePath),
        productInfo,
      });
    } else {
      results.push({
        imagePath: path.basename(imagePath),
        productInfo: { error: "Impossibile convertire l'immagine in base64" },
      });
    }

    // Attendi un po' tra una richiesta e l'altra per rispettare i rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

export { analyzeProductImage, processProductImages };
