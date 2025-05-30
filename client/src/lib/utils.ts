import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function isOfferActive(endDate: string): boolean {
  return new Date(endDate) > new Date()
}

export function calculateSavings(originalPrice?: number, offerPrice?: number): number {
  if (!originalPrice || !offerPrice) return 0
  return originalPrice - offerPrice
}
