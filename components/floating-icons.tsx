"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Code, Zap, Skull, Server, Bomb, Bug, Cpu } from "lucide-react"

interface FloatingIcon {
  id: number
  Icon: React.ElementType
  x: number
  y: number
  size: number
  speed: number
  direction: number
  opacity: number
  rotation: number
}

const FloatingIcons = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Handle resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    // Create icons
    const iconComponents = [Shield, Lock, Code, Zap, Skull, Server, Bomb, Bug, Cpu]
    const newIcons: FloatingIcon[] = []

    for (let i = 0; i < 15; i++) {
      const Icon = iconComponents[Math.floor(Math.random() * iconComponents.length)]
      newIcons.push({
        id: i,
        Icon,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: Math.random() * 0.15 + 0.05,
        rotation: Math.random() * 360,
      })
    }

    setIcons(newIcons)

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time

      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          // Calculate new position
          let newX = icon.x + Math.cos(icon.direction) * icon.speed * deltaTime * 0.1
          let newY = icon.y + Math.sin(icon.direction) * icon.speed * deltaTime * 0.1
          let newDirection = icon.direction

          // Bounce off edges
          if (newX < 0 || newX > dimensions.width) {
            newDirection = Math.PI - newDirection
            newX = Math.max(0, Math.min(newX, dimensions.width))
          }
          if (newY < 0 || newY > dimensions.height) {
            newDirection = -newDirection
            newY = Math.max(0, Math.min(newY, dimensions.height))
          }

          return {
            ...icon,
            x: newX,
            y: newY,
            direction: newDirection,
            rotation: icon.rotation + deltaTime * 0.01 * (Math.random() > 0.5 ? 1 : -1),
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          style={{
            left: icon.x,
            top: icon.y,
            opacity: icon.opacity,
            rotate: icon.rotation,
          }}
          animate={{
            rotate: icon.rotation + 360,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <icon.Icon
            className="text-red-600"
            style={{
              width: icon.size,
              height: icon.size,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingIcons
