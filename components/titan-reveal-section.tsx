"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Define types for component props and state
interface GlitchTextProps {
  text: string
  className?: string
  intensity?: number
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  hue: number
}

interface DistortionLine {
  id: number
  height: string
  top: string
  speed: number
  delay: number
  opacity: number
}

// Custom GlitchText component with enhanced effects
const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", intensity = 2 }) => {
  const [glitchActive, setGlitchActive] = useState<boolean>(false)
  const [glitchInterval, setGlitchInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Random glitch effect timing
    const activateGlitch = () => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150 + Math.random() * 400)
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        activateGlitch()
      }
    }, 2000)

    setGlitchInterval(interval)
    return () => {
      if (glitchInterval) clearInterval(glitchInterval)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Base text */}
      <div className="relative z-10">{text}</div>

      {/* Glitch layers */}
      <AnimatePresence>
        {glitchActive && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: [0, -7 * intensity, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="absolute inset-0 text-cyan-500 z-20"
              style={{ textShadow: `2px 0 cyan, -2px 0 magenta` }}
            >
              {text}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: [0, 7 * intensity, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="absolute inset-0 text-red-500 z-20"
              style={{ textShadow: `2px 0 red, -2px 0 red` }}
            >
              {text}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const TitanRevealSection: React.FC = () => {
  // State for visibility and scroll position
  const [isFixed, setIsFixed] = useState<boolean>(false)
  const [textVisible, setTextVisible] = useState<boolean>(false)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [distortionLines, setDistortionLines] = useState<DistortionLine[]>([])

  // Refs for the section container
  const sectionRef = useRef<HTMLElement | null>(null)
  const parallaxLayers = useRef<HTMLDivElement[]>([])

  // Section height - controls how long the fixed section is visible
  const sectionHeight = 2500 // Adjusted height for better pacing

  useEffect(() => {
    // Generate random particles
    const generateParticles = (): Particle[] => {
      return Array.from({ length: 50 }).map(() => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        hue: Math.random() * 60 - 20, // Red-ish hues
      }))
    }

    // Generate random distortion lines
    const generateDistortionLines = (): DistortionLine[] => {
      return Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        height: `${Math.random() * 3 + 0.5}px`,
        top: `${Math.random() * 100}%`,
        speed: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.7 + 0.3,
      }))
    }

    setParticles(generateParticles())
    setDistortionLines(generateDistortionLines())
  }, [])

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      if (!sectionRef.current) return

      // Get the section's position relative to the viewport
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionBottom = sectionTop + sectionHeight

      // Current scroll position
      const scrollY = window.scrollY

      // Check if we're in the section's scroll range
      // Make it disappear sooner by reducing the bottom threshold by 15%
      if (scrollY >= sectionTop && scrollY <= sectionBottom * 0.85) {
        setIsFixed(true)

        // Calculate progress through the section (0 to 1)
        // Adjust the calculation to make it progress faster
        const progress = (scrollY - sectionTop) / (sectionHeight * 0.85)
        setScrollProgress(Math.min(progress, 1))

        // Show text after scrolling a bit
        if (progress > 0.1 && !textVisible) {
          setTextVisible(true)
        }
      } else {
        setIsFixed(false)

        // Keep the scroll progress at 0 or 1 when outside the section
        if (scrollY < sectionTop) {
          setScrollProgress(0)
        } else if (scrollY > sectionBottom * 0.85) {
          setScrollProgress(1)
        }
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [textVisible, sectionHeight])

  // Spring animations for smoother motion
  const springConfig = { stiffness: 60, damping: 20, mass: 0.8 }
  const springScale = useSpring(1 - scrollProgress * 0.2, springConfig)
  const springRotation = useSpring(scrollProgress * -5, { stiffness: 40, damping: 30 })
  const springTextY = useSpring(scrollProgress < 0.3 ? 80 - scrollProgress * 266 : -scrollProgress * 100, springConfig)

  // Calculate values based on scroll progress
  const opacity =
    scrollProgress < 0.1
      ? scrollProgress * 10
      : scrollProgress > 0.75 // Make it fade out sooner
        ? (1 - scrollProgress) * 4
        : 1

  const brightness =
    0.3 + (scrollProgress < 0.3 ? scrollProgress * 1.5 : scrollProgress > 0.7 ? (1 - scrollProgress) * 1.5 : 0.45)

  const textOpacity =
    scrollProgress < 0.15
      ? (scrollProgress - 0.05) * 10
      : scrollProgress > 0.7 // Make text fade out sooner
        ? (0.9 - scrollProgress) * 5
        : 1

  const gradientOpacity = 0.8 - (scrollProgress < 0.5 ? scrollProgress * 0.6 : (1 - scrollProgress) * 0.6)

  const redOverlayOpacity = scrollProgress < 0.3 ? scrollProgress : scrollProgress > 0.7 ? 1 - scrollProgress : 0.3

  const scrollIndicatorOpacity = scrollProgress < 0.15 ? 1 - scrollProgress * 6.66 : 0

  // Lightning effect timing
  const [lightningActive, setLightningActive] = useState<boolean>(false)

  useEffect(() => {
    // Random lightning effect
    const triggerLightning = () => {
      if (isFixed && Math.random() > 0.7) {
        setLightningActive(true)
        setTimeout(() => setLightningActive(false), 100 + Math.random() * 100)
      }
    }

    const interval = setInterval(triggerLightning, 3000)
    return () => clearInterval(interval)
  }, [isFixed])

  // Parallax effect values
  const getParallaxStyle = (depth: number) => {
    const translateY = scrollProgress * 100 * depth
    const scale = 1 + depth * 0.2 * (1 - scrollProgress)
    return {
      transform: `translateY(${-translateY}px) scale(${scale})`,
    }
  }

  return (
    <section
      id="titan-reveal"
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${sectionHeight}px` }} // Set the height of the section
    >
      {/* This is an empty spacer that takes up space in the document flow */}
      <div style={{ height: `${sectionHeight}px` }} />

      {/* Fixed content that appears only during the section */}
      {isFixed && (
        <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-10">
          {/* Background gradient with enhanced depth */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-red-950/20"
            style={{ opacity: gradientOpacity }}
          />

          {/* Lightning flash effect */}
          <AnimatePresence>
            {lightningActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.4, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                className="absolute inset-0 bg-white z-30 pointer-events-none"
                style={{ mixBlendMode: "overlay" }}
              />
            )}
          </AnimatePresence>

          {/* Animated particles */}
          <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: `hsl(${particle.hue}, 100%, 50%)`,
                  opacity: particle.opacity * (1 - Math.abs(scrollProgress - 0.5) * 1.5),
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, -100 * particle.speed],
                  opacity: [particle.opacity, 0],
                }}
                transition={{
                  duration: 4 + particle.speed,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                  delay: particle.id % 3,
                }}
              />
            ))}
          </div>

          {/* Main image with enhanced effects */}
          <motion.div
            className="relative h-full w-full"
            style={{
              scale: springScale,
              rotateZ: springRotation,
              opacity,
            }}
          >
            {/* Parallax background layers */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <motion.div
                className="relative w-full h-full"
                style={{
                  filter: `brightness(${brightness}) contrast(1.3) hue-rotate(-10deg)`,
                }}
              >
                {/* Main image */}
                <div className="absolute inset-0" style={getParallaxStyle(0.2)}>
                  <Image
                    src="/rumbling.png"
                    alt="The Rumbling - Eren's Titan Army"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="200vw"
                  />
                </div>

                {/* Red smoke effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.8) 100%)",
                    opacity: 0.6 + scrollProgress * 0.3,
                  }}
                />

                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                  style={{
                    opacity: gradientOpacity,
                  }}
                />

                {/* Red overlay */}
                <motion.div
                  className="absolute inset-0 bg-red-900/20 mix-blend-overlay"
                  style={{
                    opacity: redOverlayOpacity,
                  }}
                />

                {/* Vignette effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "radial-gradient(circle, transparent 40%, black 130%)",
                    opacity: 0.5 + scrollProgress * 0.3,
                  }}
                />
              </motion.div>
            </div>

            {/* Distortion lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {distortionLines.map((line) => (
                <motion.div
                  key={line.id}
                  className="absolute left-0 right-0"
                  style={{
                    height: line.height,
                    top: line.top,
                    backgroundColor: "rgba(220, 38, 38, 0.7)",
                    opacity: line.opacity * (1 - Math.abs(scrollProgress - 0.5) * 1.5),
                    filter: "blur(1px)",
                  }}
                  animate={{
                    scaleX: [1, 1.02, 0.98, 1],
                    x: [0, 10, -10, 0],
                    opacity: [line.opacity * 0.5, line.opacity, line.opacity * 0.7],
                  }}
                  transition={{
                    duration: line.speed,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: line.delay,
                  }}
                />
              ))}
            </div>

            {/* VHS/Film grain effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')",
                backgroundRepeat: "repeat",
                mixBlendMode: "overlay",
                opacity: 0.1 + scrollProgress * 0.2,
              }}
            />

            {/* Text content with enhanced effects */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
              style={{
                y: springTextY,
                opacity: textOpacity,
              }}
            >
              <AnimatePresence mode="wait">
                {textVisible && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="mb-6"
                    >
                      <GlitchText
                        text="THE RUMBLING BEGINS"
                        className="text-6xl md:text-9xl font-bold text-white mb-4"
                        intensity={2 + scrollProgress * 4}
                      />
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="max-w-3xl text-xl md:text-3xl text-gray-200 mb-12 leading-relaxed"
                      style={{
                        textShadow: "0 0 10px rgba(255,0,0,0.3), 0 0 20px rgba(255,0,0,0.2)",
                      }}
                    >
                      Just as Eren unleashed devastation upon Marley, our Hawiyat platform will crush all who dare to
                      challenge it.
                    </motion.p>

                 <Link href="http://estintal-estin-hack-talents-yq6jbn-df8f46-34-31-201-166.traefik.me/">
                 <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.6,
                        type: "spring",
                        stiffness: 120,
                        damping: 12,
                      }}
                      className="relative"
                    >
                      <div className="relative z-10 bg-gradient-to-r from-red-800 to-red-950 px-12 py-6 text-white font-bold tracking-widest border border-red-700/30 shadow-lg shadow-red-900/50 text-2xl">
                        WITNESS THE POWER
                      </div>

                      {/* Pulsing glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-red-600/10"
                        animate={{
                          boxShadow: [
                            "0 0 0px 0px rgba(220,38,38,0)",
                            "0 0 40px 20px rgba(220,38,38,0.8)",
                            "0 0 20px 10px rgba(220,38,38,0.4)",
                            "0 0 30px 15px rgba(220,38,38,0.6)",
                            "0 0 0px 0px rgba(220,38,38,0)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                      />

                      {/* Edge glow effect */}
                      <motion.div
                        className="absolute -inset-1 bg-transparent border-2 border-red-500/50"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      />
                    </motion.div>                 
                 </Link>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Scroll indicator with enhanced effects */}
          <motion.div
            className="absolute bottom-12 left-0 right-0 flex justify-center"
            style={{
              opacity: scrollIndicatorOpacity,
            }}
          >
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="flex flex-col items-center"
            >
              <p className="text-gray-300 mb-3 text-base tracking-widest">SCROLL TO WITNESS</p>
              <div className="w-8 h-14 rounded-full border-2 border-gray-300 flex justify-center p-1">
                <motion.div
                  animate={{
                    y: [0, 18, 0],
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 5px 0px rgba(239,68,68,0.5)",
                      "0 0 10px 5px rgba(239,68,68,0.8)",
                      "0 0 5px 0px rgba(239,68,68,0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll progress indicator with enhanced effects */}
          <motion.div
            className="absolute bottom-5 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 rounded-full"
            style={{
              width: `${Math.min(scrollProgress * 100, 40)}%`,
              opacity:
                scrollProgress < 0.1 ? scrollProgress * 10 : scrollProgress > 0.8 ? (1 - scrollProgress) * 10 : 1,
              boxShadow: "0 0 10px 2px rgba(239,68,68,0.6)",
            }}
          >
            {/* Progress pulse effect */}
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Custom scan lines effect */}
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 3px)",
              mixBlendMode: "overlay",
              opacity: 0.3,
            }}
          />
        </div>
      )}
    </section>
  )
}

export default TitanRevealSection
