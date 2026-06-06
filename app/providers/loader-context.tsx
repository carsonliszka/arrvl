'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface LoaderContextValue {
  isLoaded: boolean
  setIsLoaded: (v: boolean) => void
  isScrollLocked: boolean
  setIsScrollLocked: (v: boolean) => void
}

const LoaderContext = createContext<LoaderContextValue>({
  isLoaded: false,
  setIsLoaded: () => {},
  isScrollLocked: false,
  setIsScrollLocked: () => {},
})

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isScrollLocked, setIsScrollLocked] = useState(false)

  return (
    <LoaderContext.Provider
      value={{ isLoaded, setIsLoaded, isScrollLocked, setIsScrollLocked }}
    >
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => useContext(LoaderContext)
