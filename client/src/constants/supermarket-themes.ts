import type { SupermarketTheme } from "@/types"
import type { SupermarketName } from "./supermarkets"

export const SUPERMARKET_THEMES: Record<SupermarketName, SupermarketTheme> = {
  todis: {
    name: "Todis",
    colors: ["#035e42", "#ea5d11", "#b6aa22"],
    gradient: "linear-gradient(135deg, #035e42 0%, #ea5d11 50%, #b6aa22 100%)",
    textColor: "text-white",
    logoPath: "/logos/todis.png",
  },
  bennet: {
    name: "Bennet",
    colors: ["#fc0b07", "#f7dfdf", "#1c1c1c"],
    gradient: "linear-gradient(135deg, #fc0b07 0%, #f7dfdf 100%)",
    textColor: "text-white",
    logoPath: "/logos/bennet.png",
  },
  carrefourexpress: {
    name: "Carrefour Express",
    colors: ["#2b8645", "#64a777", "#ebf3ed"],
    gradient: "linear-gradient(135deg, #2b8645 0%, #64a777 100%)",
    textColor: "text-white",
    logoPath: "/logos/carrefourexpress.png",
  },
  carrefourmarket: {
    name: "Carrefour Market",
    colors: ["#fb0509", "#f64645", "#fce2e2"],
    gradient: "linear-gradient(135deg, #fb0509 0%, #f64645 100%)",
    textColor: "text-white",
    logoPath: "/logos/carrefourmarket.png",
  },
  centesimo: {
    name: "Centesimo",
    colors: ["#caaf0c", "#2a2627", "#6d5f12"],
    gradient: "linear-gradient(135deg, #caaf0c 0%, #6d5f12 100%)",
    textColor: "text-black",
    logoPath: "/logos/centesimo.png",
  },
  crai: {
    name: "Crai",
    colors: ["#ef4123", "#81b39d", "#ccdfd6"],
    gradient: "linear-gradient(135deg, #ef4123 0%, #81b39d 100%)",
    textColor: "text-white",
    logoPath: "/logos/crai.jpeg",
  },
  esselunga: {
    name: "Esselunga",
    colors: ["#0b3a74", "#e10314", "#f0f1f4"],
    gradient: "linear-gradient(135deg, #0b3a74 0%, #e10314 100%)",
    textColor: "text-white",
    logoPath: "/logos/esselunga.png",
  },
  eurospin: {
    name: "Eurospin",
    colors: ["#2b4e9c", "#eac62c", "#c3cad1"],
    gradient: "linear-gradient(135deg, #2b4e9c 0%, #eac62c 100%)",
    textColor: "text-white",
    logoPath: "/logos/eurospin.png",
  },
  gigante: {
    name: "Il Gigante",
    colors: ["#0f2253", "#df050f", "#f2eeef"],
    gradient: "linear-gradient(135deg, #0f2253 0%, #df050f 100%)",
    textColor: "text-white",
    logoPath: "/logos/gigante.png",
  },
  ins: {
    name: "IN's Mercato",
    colors: ["#fcf00d", "#124393", "#cdd43c"],
    gradient: "linear-gradient(135deg, #fcf00d 0%, #124393 100%)",
    textColor: "text-black",
    logoPath: "/logos/ins.png",
  },
  lidl: {
    name: "Lidl",
    colors: ["#fff001", "#0850a8", "#e31114"],
    gradient: "linear-gradient(135deg, #fff001 0%, #0850a8 50%, #e31114 100%)",
    textColor: "text-black",
    logoPath: "/logos/lidl.png",
  },
  md: {
    name: "MD Discount",
    colors: ["#f9ea20", "#1b5fa5", "#dd1915"],
    gradient: "linear-gradient(135deg, #f9ea20 0%, #1b5fa5 50%, #dd1915 100%)",
    textColor: "text-black",
    logoPath: "/logos/md.png",
  },
  paghipoco: {
    name: "Pam Panorama",
    colors: ["#e00c14", "#fee80d", "#dd5e60"],
    gradient: "linear-gradient(135deg, #e00c14 0%, #fee80d 100%)",
    textColor: "text-white",
    logoPath: "/logos/paghipoco.png",
  },
  prestofresco: {
    name: "Presto Fresco",
    colors: ["#e30f15", "#ece3e3", "#0e643c"],
    gradient: "linear-gradient(135deg, #e30f15 0%, #0e643c 100%)",
    textColor: "text-white",
    logoPath: "/logos/prestofresco.png",
  },
  // Placeholder themes for missing supermarkets
  conad: {
    name: "Conad",
    colors: ["#e31e24", "#ffffff"],
    gradient: "linear-gradient(135deg, #e31e24 0%, #ffffff 100%)",
    textColor: "text-white",
    logoPath: "/logos/conad.png",
  },
  auchan: {
    name: "Auchan",
    colors: ["#e31e24", "#ffffff"],
    gradient: "linear-gradient(135deg, #e31e24 0%, #ffffff 100%)",
    textColor: "text-white",
    logoPath: "/logos/auchan.png",
  },
  penny: {
    name: "Penny Market",
    colors: ["#e31e24", "#ffffff"],
    gradient: "linear-gradient(135deg, #e31e24 0%, #ffffff 100%)",
    textColor: "text-white",
    logoPath: "/logos/penny.png",
  },
  despar: {
    name: "Despar",
    colors: ["#e31e24", "#ffffff"],
    gradient: "linear-gradient(135deg, #e31e24 0%, #ffffff 100%)",
    textColor: "text-white",
    logoPath: "/logos/despar.png",
  },
  carrefouriper: {
    name: "Carrefour Iper",
    colors: ["#fb0509", "#f64645"],
    gradient: "linear-gradient(135deg, #fb0509 0%, #f64645 100%)",
    textColor: "text-white",
    logoPath: "/logos/carrefouriper.png",
  },
}

export function getSupermarketTheme(supermarketName: string): SupermarketTheme {
  const theme = SUPERMARKET_THEMES[supermarketName as SupermarketName]
  if (!theme) {
    // Fallback theme
    return {
      name: supermarketName,
      colors: ["#6b7280", "#ffffff"],
      gradient: "linear-gradient(135deg, #6b7280 0%, #ffffff 100%)",
      textColor: "text-white",
      logoPath: "/placeholder.svg",
    }
  }
  return theme
}
