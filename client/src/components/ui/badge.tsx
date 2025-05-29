"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "danger" | "warning"
  size?: "sm" | "md"
}

export function Badge({ className, variant = "default", size = "sm", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full"

  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  }

  const sizes = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }

  return <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />
}
