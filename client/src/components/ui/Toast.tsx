"use client"

import { toast, ToastContainer, type ToastOptions } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

// Opzioni di base per i toast
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: "rounded-xl font-medium",
  closeButton: ({ closeToast }) => (
    <button onClick={closeToast} className="p-1 rounded-full hover:bg-gray-100">
      <X className="h-4 w-4" />
    </button>
  ),
}

// Funzioni per mostrare diversi tipi di toast
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        className: `${defaultOptions.className} bg-green-50 text-green-800 border border-green-200`,
        progressClassName: "bg-green-500",
        ...options,
      },
    )
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        className: `${defaultOptions.className} bg-red-50 text-red-800 border border-red-200`,
        progressClassName: "bg-red-500",
        ...options,
      },
    )
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(
      <div className="flex items-center">
        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        className: `${defaultOptions.className} bg-primary-50 text-primary-800 border border-primary-200`,
        progressClassName: "bg-primary-500",
        ...options,
      },
    )
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
        <span>{message}</span>
      </div>,
      {
        ...defaultOptions,
        className: `${defaultOptions.className} bg-yellow-50 text-yellow-800 border border-yellow-200`,
        progressClassName: "bg-yellow-500",
        ...options,
      },
    )
  },
}

// Componente ToastContainer personalizzato
export function ToastContainerWrapper() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="mt-16" // Aggiunge spazio sopra per evitare sovrapposizioni con la navbar
    />
  )
}
