"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: number
}

const GlitchText = ({ text, className, intensity = 1 }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true)

        // Text distortion for more intense glitches
        if (Math.random() > 0.7 && intensity > 1) {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|'
          const textArray = text.split("")

          // Replace random characters
          for (let i = 0; i < Math.floor(text.length * 0.2 * intensity); i++) {
            const randomIndex = Math.floor(Math.random() * text.length)
            const randomChar = characters.charAt(Math.floor(Math.random() * characters.length))
            textArray[randomIndex] = randomChar
          }

          setGlitchText(textArray.join(""))

          // Reset text after a short delay
          setTimeout(() => {
            setGlitchText(text)
          }, 100)
        }

        setTimeout(() => setIsGlitching(false), 150 * intensity)
      }
    }, 3000 / intensity)

    return () => clearInterval(glitchInterval)
  }, [text, intensity])

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Main text */}
      <span className="relative z-10">{isGlitching ? glitchText : text}</span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-600 z-0"
            animate={{
              x: [0, -5 * intensity, 3 * intensity, -2 * intensity, 0],
              opacity: [1, 0.8, 0.9, 0.7, 1],
            }}
            transition={{ duration: 0.2 * intensity }}
          >
            {glitchText}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyan-500 z-0"
            animate={{
              x: [0, 5 * intensity, -3 * intensity, 2 * intensity, 0],
              opacity: [1, 0.7, 0.9, 0.8, 1],
            }}
            transition={{ duration: 0.2 * intensity }}
          >
            {glitchText}
          </motion.span>
          {intensity > 1 && (
            <motion.span
              className="absolute inset-0 text-yellow-500 z-0"
              animate={{
                y: [0, 3 * intensity, -2 * intensity, 1 * intensity, 0],
                opacity: [1, 0.6, 0.8, 0.7, 1],
              }}
              transition={{ duration: 0.2 * intensity }}
            >
              {glitchText}
            </motion.span>
          )}
        </>
      )}
    </div>
  )
}

export default GlitchText
