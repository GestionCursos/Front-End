import type React from "react"
import { ChatbotProvider } from "@/contexts/chatbot-provider"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ChatbotProvider>
          {children}
          <ChatbotWidget />
        </ChatbotProvider>
      </body>
    </html>
  )
}
