"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  content: string
  isUser: boolean
  timestamp: Date
  audioUrl?: string
}

export function MessageBubble({ content, isUser, timestamp, audioUrl }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handlePlayAudio = async () => {
    // Solo controla el audioUrl, no TTS
    // El control de play/pausa real está en el componente padre o en el audio HTML5
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Error copying text:", error)
    }
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3 text-sm group",
          isUser ? "bg-primary text-white" : "bg-gray-100 text-gray-900 border border-gray-200",
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {/* Controles para mensajes del bot */}
        {!isUser && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200"
              onClick={handleCopyText}
              title="Copiar texto"
            >
              {isCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
         
        )}
        {/* Render audio player if audioUrl is present */}
        {audioUrl && (
          <div className="mt-2">
            <audio controls src={audioUrl} style={{ width: '100%' }} preload="auto" />
          </div>
        )}

        

        <div className={cn("text-xs mt-1", isUser ? "text-white/70" : "text-gray-500")}>
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}
