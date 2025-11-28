"use client"

import { Suspense, useEffect, useState, lazy } from 'react'
import { motion } from 'framer-motion'
import { detectAnimationCapabilities } from '@/context/lib/animation-utils'
import { siteConfig } from '@/context/config/site'

// Lazy load animation components
const HeroFallback = lazy(() => import('./hero-fallback'))
const Hero3DScene = lazy(() => import('./hero-3d-scene'))
const HeroParticles = lazy(() => import('./hero-particles'))
const HeroBlobs = lazy(() => import('./hero-blobs'))
const HeroTyping = lazy(() => import('./hero-typing'))

interface AnimationCapabilities {
  advanced: boolean
  webgl: boolean
  reducedMotion: boolean
}

export function HeroMain() {
  const [capabilities, setCapabilities] = useState<AnimationCapabilities>({
    advanced: false,
    webgl: false,
    reducedMotion: false,
  })
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Detect capabilities on client side only
    const caps = detectAnimationCapabilities()
    setCapabilities(caps)

    // Small delay to ensure smooth initial render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Determine which animations to show based on viewport and capabilities
  const shouldShowAdvanced = isMounted && capabilities.advanced && !capabilities.reducedMotion
  const shouldShow3D = shouldShowAdvanced && typeof window !== 'undefined' && window.innerWidth >= 1280
  const shouldShowParticles = isMounted && capabilities.webgl && !capabilities.reducedMotion
  const shouldShowBlobs = isMounted && !capabilities.reducedMotion

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark pt-24 md:pt-0">
      {/* Animation Layers - Progressive Enhancement */}

      {/* Layer 0: Fallback (always rendered as base) */}
      <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-gray-900 to-primary-dark" />}>
        <HeroFallback />
      </Suspense>

      {/* Layer 1: 3D Scene (Desktop only, high-end devices) */}
      {shouldShow3D && (
        <Suspense fallback={null}>
          <Hero3DScene />
        </Suspense>
      )}

      {/* Layer 2: Particle System (WebGL capable devices, tablet+) */}
      {shouldShowParticles && !capabilities.reducedMotion && (
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>
      )}

      {/* Layer 3: Morphing Blobs (Most devices except reduced motion) */}
      {shouldShowBlobs && (
        <Suspense fallback={null}>
          <HeroBlobs />
        </Suspense>
      )}

      {/* Layer 4: Typing Animation (Desktop, corner accent) */}
      {shouldShowAdvanced && (
        <Suspense fallback={null}>
          <HeroTyping />
        </Suspense>
      )}

      {/* Layer 5: Main Content (Always visible, highest z-index) */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-between min-h-screen">
        <div className="relative" style={{ marginLeft: '10%', marginTop: '-5vh' }}>
          {/* Dark radial gradient background */}
          <div
            className="absolute inset-0 -inset-x-8 -inset-y-6 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(13, 18, 30, 0.65) 0%, rgba(13, 18, 30, 0.4) 50%, transparent 100%)',
              borderRadius: '48px',
              width: '320px',
              height: '180px',
              left: '-16px',
              top: '-24px'
            }}
          />

          {/* Terminal prompt content */}
          <div className="relative max-w-md">
            {/* H1: Command-line styled title */}
            <h1
              className="font-mono font-semibold mb-4 text-left"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 600,
                color: '#32B8C6',
                lineHeight: 1.2,
                letterSpacing: '-0.01em'
              }}
            >
              $ Building accessible web for everyone
              <span className="animate-pulse" style={{ animation: 'blink 1s step-end infinite' }}>_</span>
            </h1>

            {/* H2: Value proposition */}
            <h2
              className="font-mono text-left"
              style={{
                fontSize: 'clamp(14px, 2.5vw, 24px)',
                fontWeight: 400,
                color: '#5FA8B3',
                opacity: 0.9,
                lineHeight: 1.6
              }}
            >
              Professional websites. Student prices.
            </h2>
          </div>
        </div>

        {/* Terminal Navigation Links (Right side) */}
        <div className="hidden lg:flex flex-col gap-12 font-mono" style={{ marginRight: '10%', marginTop: '-5vh' }}>
          {/* About Us */}
          <a
            href="/staff"
            className="group flex items-center gap-4 transition-all duration-300"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ color: '#8DD6E0', fontSize: '32px' }}>&gt;</span>
            <motion.span
              style={{ color: '#32B8C6', fontSize: '32px', fontWeight: 500 }}
              whileHover={{ color: '#8DD6E0', x: 8 }}
              transition={{ duration: 0.2 }}
            >
              about_us
            </motion.span>
          </a>

          {/* Purchase */}
          <a
            href="/purchase"
            className="group flex items-center gap-4 transition-all duration-300"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ color: '#8DD6E0', fontSize: '32px' }}>&gt;</span>
            <motion.span
              style={{ color: '#32B8C6', fontSize: '32px', fontWeight: 500 }}
              whileHover={{ color: '#8DD6E0', x: 8 }}
              transition={{ duration: 0.2 }}
            >
              purchase
            </motion.span>
          </a>

          {/* Contact Us */}
          <a
            href="/contact"
            className="group flex items-center gap-4 transition-all duration-300"
            style={{ textDecoration: 'none' }}
          >
            <span style={{ color: '#8DD6E0', fontSize: '32px' }}>&gt;</span>
            <motion.span
              style={{ color: '#32B8C6', fontSize: '32px', fontWeight: 500 }}
              whileHover={{ color: '#8DD6E0', x: 8 }}
              transition={{ duration: 0.2 }}
            >
              contact_us
            </motion.span>
          </a>
        </div>

        {/* Loading indicator (shown briefly on mount) */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-dark/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* CSS for blinking cursor animation */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>WebGL: {capabilities.webgl ? '✓' : '✗'}</div>
          <div>Advanced: {capabilities.advanced ? '✓' : '✗'}</div>
          <div>Reduced Motion: {capabilities.reducedMotion ? '✓' : '✗'}</div>
          <div>3D: {shouldShow3D ? '✓' : '✗'}</div>
          <div>Particles: {shouldShowParticles ? '✓' : '✗'}</div>
        </div>
      )}
    </section>
  )
}
