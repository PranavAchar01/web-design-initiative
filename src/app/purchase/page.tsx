'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { createCheckoutSession } from '@/app/actions/stripe'
import { useRouter } from 'next/navigation'

interface ServiceTier {
  name: string
  price: string
  services: string[]
  accentColor: string
  command: string
}

const tiers: ServiceTier[] = [
  {
    name: 'Student',
    price: '$20/month',
    command: '$ student --plan',
    accentColor: '#32B8C6', // Cyan
    services: [
      '5 Pages',
      'Responsive Design',
      'Basic SEO',
      'SSL Certificate',
      'Email Support',
      '1-Month Revisions',
    ],
  },
  {
    name: 'Professional',
    price: '$100/month',
    command: '$ professional --plan',
    accentColor: '#B366FF', // Purple
    services: [
      '15 Pages',
      'Advanced Analytics',
      'Blog System',
      'Premium SEO',
      'Priority Support',
      'Unlimited Revisions',
      '3-Month Updates',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    command: '$ enterprise --plan',
    accentColor: '#FFA500', // Orange
    services: [
      'Unlimited Pages',
      'Custom Features',
      'Advanced Integrations',
      'Dedicated Support',
      'CRM/Database Setup',
      '1-Year Support',
      'Weekly Optimization',
    ],
  },
]

function TypewriterText({ text, delay = 0, speed = 50, style = {} }: { text: string, delay?: number, speed?: number, style?: React.CSSProperties }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, speed)
        return () => clearTimeout(timeout)
      }
    }, delay)
    return () => clearTimeout(startTimeout)
  }, [currentIndex, text, delay, speed])

  return <span style={style}>{displayedText}<span className="animate-pulse">_</span></span>
}

// Morphing blob shapes
const BLOB_SHAPES = [
  "M60,-65C75.9,-54.4,85.9,-33.4,87.3,-11.9C88.7,9.6,81.5,31.6,68.3,48.3C55.1,65,36,76.4,15.9,79.9C-4.2,83.4,-25.2,79,-41.8,67.8C-58.4,56.6,-70.6,38.6,-75.4,18.8C-80.2,-1,-77.6,-22.6,-67.8,-39.4C-58,-56.2,-40.9,-68.2,-22.4,-72.8C-3.9,-77.4,16,-74.6,33.6,-71.4C51.2,-68.2,66.5,-64.6,60,-65Z",
  "M54.3,-63.5C69.7,-53.1,81.2,-34.3,84.5,-14.2C87.8,5.9,82.9,27.3,71.5,44.3C60.1,61.3,42.2,73.9,22.7,78.9C3.2,83.9,-17.9,81.3,-36.4,73.1C-54.9,64.9,-70.8,51.1,-77.4,33.8C-84,16.5,-81.3,-4.3,-74.1,-22.6C-66.9,-40.9,-55.2,-56.7,-40.3,-67.3C-25.4,-77.9,-7.2,-83.3,9.4,-84.1C26,-84.9,38.9,-73.9,54.3,-63.5Z",
  "M49.7,-58.5C63.5,-48.2,73.3,-31.7,76.8,-13.7C80.3,4.3,77.5,23.8,68.4,39.4C59.3,55,43.9,66.7,26.3,72.3C8.7,77.9,-11.1,77.4,-28.4,71.1C-45.7,64.8,-60.5,52.7,-68.9,37.1C-77.3,21.5,-79.3,2.4,-75.8,-15.3C-72.3,-33,-63.3,-49.3,-49.9,-59.8C-36.5,-70.3,-18.2,-75,0.1,-75.1C18.4,-75.2,36.8,-68.8,49.7,-58.5Z",
]

interface BlobProps {
  x: string
  y: string
  color: string
  size: number
  duration: number
}

function MorphingBlob({ x, y, color, size, duration }: BlobProps) {
  const [pathIndex, setPathIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((prev) => (prev + 1) % BLOB_SHAPES.length)
    }, duration)
    return () => clearInterval(interval)
  }, [duration])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        filter: 'blur(60px)',
        opacity: 0.15,
      }}
      animate={{
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          fill={color}
          d={BLOB_SHAPES[pathIndex]}
          transform="translate(100 100)"
          animate={{ d: BLOB_SHAPES[pathIndex] }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  )
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particleCount = 100
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height

      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(50, 184, 198, 0.4)'
      ctx.fill()
    }

    const drawLine = (p1: Particle, p2: Particle, distance: number) => {
      const opacity = (1 - distance / 120) * 0.15
      ctx.beginPath()
      ctx.strokeStyle = `rgba(50, 184, 198, ${opacity})`
      ctx.lineWidth = 0.5
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Mouse repulsion
      const dx = particle.x - mouseRef.current.x
      const dy = particle.y - mouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.vx += (dx / distance) * force * 0.15
        particle.vy += (dy / distance) * force * 0.15
      }

      particle.vx *= 0.98
      particle.vy *= 0.98

      if (particle.x < 0) particle.x = canvas.width
      if (particle.x > canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = canvas.height
      if (particle.y > canvas.height) particle.y = 0

      if (Math.abs(particle.vx) < 0.05) particle.vx += (Math.random() - 0.5) * 0.05
      if (Math.abs(particle.vy) < 0.05) particle.vy += (Math.random() - 0.5) * 0.05
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      particles.forEach((particle) => {
        updateParticle(particle)
        drawParticle(particle)
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            drawLine(particles[i], particles[j], distance)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

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
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

function CheckoutButton({ tier, accentColor }: { tier: string, accentColor: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const tierKey = tier.toLowerCase() as 'student' | 'professional' | 'enterprise'
      const result = await createCheckoutSession(tierKey)

      if ('isContactForm' in result && result.isContactForm) {
        router.push(result.url!)
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

  const buttonText = tier === 'Enterprise' ? 'Contact Us' : 'Subscribe'
  const command = tier === 'Enterprise' ? '$ ./contact.sh' : '$ ./checkout.sh'

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <div className="font-mono text-xs text-gray-500">{command}</div>
      <motion.button
        onClick={handleCheckout}
        disabled={isLoading}
        className="font-mono text-sm px-6 py-2 border transition-all duration-200"
        style={{
          borderColor: accentColor,
          color: accentColor,
          backgroundColor: 'transparent',
        }}
        whileHover={{
          backgroundColor: accentColor,
          color: '#0D121E',
          scale: 1.02
        }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? '> Loading...' : `> ${buttonText}`}
      </motion.button>
    </div>
  )
}

export default function PurchasePage() {
  return (
    <div className="min-h-screen bg-primary-dark relative overflow-hidden flex items-center justify-center">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-gray-900 to-primary-dark" />

      {/* Morphing blobs - using tier colors */}
      <MorphingBlob x="10%" y="20%" color="#32B8C6" size={400} duration={7000} />
      <MorphingBlob x="70%" y="60%" color="#B366FF" size={450} duration={8000} />
      <MorphingBlob x="40%" y="10%" color="#FFA500" size={350} duration={6000} />

      {/* Particle system with mouse interaction */}
      <ParticleSystem />

      {/* Page Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center py-20">
        {/* Service Tiers - Text Only */}
        <div className="w-full h-full flex items-center justify-center gap-32 px-20">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className="flex flex-col items-center justify-center border border-white p-8 py-20 rounded max-w-xs w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.3 }}
            >
              {/* Command Header */}
              <div className="font-mono text-sm text-gray-400 mb-6">
                <TypewriterText text={tier.command} delay={index * 60} speed={6} />
              </div>

              {/* Tier Name */}
              <h2 className="font-mono text-2xl font-bold mb-4">
                <TypewriterText text={tier.name} delay={index * 60 + 100} speed={8} style={{ color: tier.accentColor }} />
              </h2>

              {/* Price */}
              <div className="text-3xl font-bold mb-8 font-mono">
                <TypewriterText text={tier.price} delay={index * 60 + 180} speed={8} style={{ color: tier.accentColor }} />
              </div>

              {/* Services List */}
              <ul className="space-y-2 text-center">
                {tier.services.map((service, i) => (
                  <li key={i} className="text-gray-300 font-mono text-sm">
                    {service}
                  </li>
                ))}
              </ul>

              {/* Checkout Button */}
              <CheckoutButton tier={tier.name} accentColor={tier.accentColor} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
