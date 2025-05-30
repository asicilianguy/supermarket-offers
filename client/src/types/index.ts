// User types
export interface User {
  _id: string
  name: string
  phoneNumber: string
  frequentedSupermarkets: string[]
  shoppingList: ShoppingListItem[]
  createdAt: string
  updatedAt: string
}

export interface ShoppingListItem {
  _id: string
  productName: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Offer types
export interface ProductOffer {
  _id: string
  productName: string
  productQuantity?: string
  offerPrice: number
  previousPrice?: number
  discountPercentage?: number
  pricePerKg?: number
  pricePerLiter?: number
  offerStartDate: string
  offerEndDate: string
  brand?: string
  supermarketAisle: string[]
  chainName: string
  createdAt: string
  updatedAt: string
}

// API Response types
export interface UserShoppingListResponse {
  success: boolean
  data: ShoppingListItem[]
}

export interface OffersResponse {
  success: boolean
  data: ProductOffer[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ShoppingListOffersResponse {
  success: boolean
  data: Array<{
    productName: string
    offers: ProductOffer[]
  }>
}

// Auth types
export interface LoginCredentials {
  phoneNumber: string
  password: string
}

export interface RegisterCredentials {
  name: string
  phoneNumber: string
  password: string
  frequentedSupermarkets: string[]
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

// Update types
export interface UpdateShoppingListItemPayload {
  id: string
  productName?: string
  notes?: string
}

export interface AddShoppingListItemPayload {
  productName: string
  notes?: string
}

export interface UpdateSupermarketsPayload {
  frequentedSupermarkets: string[]
}

// Supermarket theme types
export interface SupermarketTheme {
  name: string
  colors: string[]
  gradient: string
  textColor: string
  logoPath: string
}
