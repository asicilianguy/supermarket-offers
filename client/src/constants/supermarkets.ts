export const SUPERMARKET_CHAINS = [
  { value: "auchan", label: "Auchan" },
  { value: "bennet", label: "Bennet" },
  { value: "carrefour-express", label: "Carrefour Express" },
  { value: "carrefour-iper", label: "Carrefour Iper" },
  { value: "carrefour-market", label: "Carrefour Market" },
  { value: "centesimo", label: "Centesimo" },
  { value: "conad", label: "Conad" },
  { value: "crai", label: "Crai" },
  { value: "despar", label: "Despar" },
  { value: "esselunga", label: "Esselunga" },
  { value: "eurospin", label: "Eurospin" },
  { value: "gigante", label: "Gigante" },
  { value: "ins", label: "Ins" },
  { value: "lidl", label: "Lidl" },
  { value: "md", label: "MD" },
  { value: "paghipoco", label: "Paghi Poco" },
  { value: "penny", label: "Penny Market" },
  { value: "prestofresco", label: "Presto Fresco" },
  { value: "todis", label: "Todis" },
] as const

export type SupermarketChain = (typeof SUPERMARKET_CHAINS)[number]["value"]
