"use client"

import { useEffect, useRef } from 'react'

/**
 * Hero Particle System - Layer 2
 *
 * Per WDI_REDESIGN_SPECIFICATION.md:
 * - 150-300 particles
 * - Connecting lines when particles are close
 * - Mouse repulsion effect (particles avoid cursor)
 * - Gentle floating animation
 * - Particle Size: 2-4px circles
 * - Connection Threshold: 120px
 * - Line Opacity: 0.2
 * - Colors: Gradient from --particle-blue to --particle-cyan
 * - Movement: Smooth Perlin noise-based flow
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseX: number
  baseY: number
}

const PARTICLE_COLORS = {
  blue: 'rgba(37, 99, 235, 0.6)',
  cyan: 'rgba(6, 182, 212, 0.4)',
}

const CONNECTION_DISTANCE = 120
const LINE_OPACITY = 0.2
const MOUSE_RADIUS = 100
const REPULSION_FORCE = 0.2

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Determine particle count based on viewport
    const getParticleCount = () => {
      const width = window.innerWidth
      if (width >= 1920) return 300
      if (width >= 1280) return 200
      if (width >= 768) return 150
      return 100
    }

    // Initialize particles
    const initParticles = () => {
      const count = getParticleCount()
      particlesRef.current = []

      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 2, // 2-4px
          baseX: x,
          baseY: y,
        })
      }
    }
    initParticles()

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Draw particle
    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)

      // Gradient color based on position
      const colorRatio = particle.y / canvas.height
      ctx.fillStyle = colorRatio > 0.5 ? PARTICLE_COLORS.cyan : PARTICLE_COLORS.blue
      ctx.fill()
    }

    // Draw connection line
    const drawLine = (p1: Particle, p2: Particle, distance: number) => {
      const opacity = (1 - distance / CONNECTION_DISTANCE) * LINE_OPACITY
      ctx.beginPath()
      ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`
      ctx.lineWidth = 1
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    // Update particle position
    const updateParticle = (particle: Particle) => {
      // Gentle floating movement
      particle.x += particle.vx
      particle.y += particle.vy

      // Mouse repulsion
      const dx = particle.x - mouseRef.current.x
      const dy = particle.y - mouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
        particle.vx += (dx / distance) * force * REPULSION_FORCE
        particle.vy += (dy / distance) * force * REPULSION_FORCE
      }

      // Apply damping
      particle.vx *= 0.98
      particle.vy *= 0.98

      // Boundary check with wrap-around
      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      // Keep particles moving gently
      if (Math.abs(particle.vx) < 0.1) {
        particle.vx += (Math.random() - 0.5) * 0.1
      }
      if (Math.abs(particle.vy) < 0.1) {
        particle.vy += (Math.random() - 0.5) * 0.1
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONNECTION_DISTANCE) {
            drawLine(particles[i], particles[j], distance)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[3] pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}
