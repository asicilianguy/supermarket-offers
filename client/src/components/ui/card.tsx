"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function Card({ className, children, hover = false, ...props }: CardProps) {
  const Component = hover ? motion.div : "div"
  const componentProps = hover
    ? {
        whileHover: { y: -5 },
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Component
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
        hover && "transition-shadow hover:shadow-md",
        className,
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-b border-gray-100", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-t border-gray-100", className)} {...props} />
}
