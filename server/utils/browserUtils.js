/**
 * Funzione di utility per ritardare l'esecuzione
 * @param {number} ms - Millisecondi di ritardo
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Funzione di retry per operazioni soggette a fallimenti
 * @param {Function} operation - Funzione da eseguire
 * @param {number} maxRetries - Numero massimo di tentativi
 * @param {number} delayMs - Ritardo tra i tentativi
 * @returns {Promise<any>} - Risultato dell'operazione
 */
async function withRetry(operation, maxRetries = 3, delayMs = 2000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await delay(delayMs);
      }
    }
  }
  throw new Error(`Dopo ${maxRetries} tentativi: ${lastError.message}`);
}

export { delay, withRetry };
