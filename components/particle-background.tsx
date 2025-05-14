"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
      originalSize: number
      pulseDirection: number
      pulseSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.originalSize = Math.random() * 3 + 0.5
        this.size = this.originalSize
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = Math.random() > 0.8 ? "#ff3333" : "#ff6666"
        this.alpha = Math.random() * 0.5 + 0.1
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1
        this.pulseSpeed = Math.random() * 0.02 + 0.01
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Pulse size effect
        this.size += this.pulseDirection * this.pulseSpeed
        if (this.size > this.originalSize * 1.5 || this.size < this.originalSize * 0.5) {
          this.pulseDirection *= -1
        }

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }

        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.alpha
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 8000))

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Mouse interaction
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150,
    }

    window.addEventListener("mousemove", (event) => {
      mouse.x = event.x
      mouse.y = event.y
    })

    window.addEventListener("mouseout", () => {
      mouse.x = null
      mouse.y = null
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.lineWidth = 0.3

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Create gradient for lines
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            gradient.addColorStop(0, `rgba(255, 51, 51, ${(1 - distance / 150) * 0.5})`)
            gradient.addColorStop(1, `rgba(255, 102, 102, ${(1 - distance / 150) * 0.3})`)

            ctx.strokeStyle = gradient
            ctx.globalAlpha = (1 - distance / 150) * 0.4
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      for (const particle of particles) {
        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x
          const dy = particle.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius

            particle.x += forceDirectionX * force * 2
            particle.y += forceDirectionY * force * 2
          }
        }

        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", (event) => {
        mouse.x = event.x
        mouse.y = event.y
      })
      window.removeEventListener("mouseout", () => {
        mouse.x = null
        mouse.y = null
      })
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" style={{ pointerEvents: "none" }} />
}

export default ParticleBackground
