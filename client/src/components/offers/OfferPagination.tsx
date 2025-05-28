"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface OfferPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function OfferPagination({ currentPage, totalPages, onPageChange }: OfferPaginationProps) {
  const renderPageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 ? "bg-primary-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        1
      </button>,
    )

    // Calculate range of pages to show
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-start" className="px-2">
          ...
        </span>,
      )
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i ? "bg-primary-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-end" className="px-2">
          ...
        </span>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages ? "bg-primary-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
