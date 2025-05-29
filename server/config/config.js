import path from "path";
import { fileURLToPath } from "url";

// In ESM, __dirname non è disponibile direttamente
// Dobbiamo ricrearlo usando fileURLToPath e path.dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = process.env.PORT || 3001;
export const DOWNLOAD_DIR = path.join(__dirname, "..", "downloads");
