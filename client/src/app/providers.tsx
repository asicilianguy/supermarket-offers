"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/redux/store"
import { HeroUIProvider } from "@heroui/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </Provider>
  )
}
