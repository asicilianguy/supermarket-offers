"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, ShoppingCart } from "lucide-react"
import {
  useGetShoppingListQuery,
  useAddToShoppingListMutation,
  useRemoveFromShoppingListMutation,
} from "@/redux/features/user/userApiSlice"

export default function ShoppingList() {
  const { data: shoppingList, isLoading } = useGetShoppingListQuery()
  const [addToShoppingList] = useAddToShoppingListMutation()
  const [removeFromShoppingList] = useRemoveFromShoppingListMutation()

  const [newItem, setNewItem] = useState("")
  const [newItemNotes, setNewItemNotes] = useState("")

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newItem.trim()) return

    try {
      await addToShoppingList({
        productName: newItem.trim(),
        notes: newItemNotes.trim() || undefined,
      }).unwrap()

      setNewItem("")
      setNewItemNotes("")
    } catch (error) {
      console.error("Failed to add item to shopping list:", error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromShoppingList(itemId).unwrap()
    } catch (error) {
      console.error("Failed to remove item from shopping list:", error)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-primary-500" />
            La tua lista della spesa
          </h2>
          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {isLoading ? "..." : shoppingList?.length || 0} prodotti
          </span>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleAddItem} className="mb-6">
          <div className="mb-3">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Aggiungi un prodotto
            </label>
            <input
              type="text"
              id="productName"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Es. Latte, Pane, Pasta..."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Note (opzionale)
            </label>
            <input
              type="text"
              id="notes"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Es. Marca preferita, quantità..."
            />
          </div>

          <button
            type="submit"
            disabled={!newItem.trim()}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi alla lista
          </button>
        </form>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : shoppingList && shoppingList.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {shoppingList.map((item: any) => (
              <motion.li
                key={item._id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    {item.notes && <p className="text-xs text-gray-500">{item.notes}</p>}
                  </div>
                  <button onClick={() => handleRemoveItem(item._id)} className="text-gray-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">La tua lista della spesa è vuota</p>
            <p className="text-sm text-gray-400 mt-1">Aggiungi prodotti per ricevere suggerimenti sulle offerte</p>
          </div>
        )}
      </div>
    </div>
  )
}
