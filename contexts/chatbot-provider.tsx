"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatbotContextType {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error("useChatbot debe usarse dentro de un ChatbotProvider")
  }
  return context
}

interface ChatbotProviderProps {
  children: ReactNode
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ChatbotContext.Provider value={{ isEnabled, setIsEnabled, isOpen, setIsOpen }}>{children}</ChatbotContext.Provider>
  )
}
