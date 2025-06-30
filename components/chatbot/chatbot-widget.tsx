"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, MessageCircle, X } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { useChatbot } from "@/contexts/chatbot-provider"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  audioUrl?: string
}

export function ChatbotWidget() {
  const { isEnabled, isOpen, setIsOpen } = useChatbot()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "¡Hola! Soy el asistente virtual de EduEvents. ¿En qué puedo ayudarte hoy?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // INTEGRACIÓN DIRECTA CON TU API
      const response = await fetch(process.env.NEXT_PUBLIC_CHATBOT_API_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: currentInput }),
      });
      if (response.ok) {
        // Intenta extraer el texto y el audio si la API devuelve ambos
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          let audioUrl: string | undefined = undefined;
          if (data.audio) {
            audioUrl = `data:audio/mp3;base64,${data.audio}`;
          }
          // Muestra el texto y el audio juntos en la misma burbuja
          const botMessage = {
            id: (Date.now() + 1).toString(),
            content: data.texto || '',
            isUser: false,
            timestamp: new Date(),
            ...(audioUrl ? { audioUrl } : {}),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          // Si la respuesta es audio directo
          const audioBlob = await response.blob();
          const fixedAudioBlob = audioBlob.type === 'audio/mpeg' ? audioBlob : new Blob([audioBlob], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(fixedAudioBlob);
          const botMessage = {
            id: (Date.now() + 1).toString(),
            content: '',
            isUser: false,
            timestamp: new Date(),
            audioUrl,
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } else {
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          content: "Lo siento, hubo un error al obtener el audio.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error de conexión con la API.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  if (!isEnabled) return null

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all z-50"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-medium">Asistente Virtual</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensajes */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  audioUrl={message.audioUrl}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// El archivo chatbot-api.js ha sido desintegrado. Toda la lógica de mensajes y audio ahora depende solo de la API externa.
