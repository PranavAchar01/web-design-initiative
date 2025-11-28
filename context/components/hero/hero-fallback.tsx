"use client"

/**
 * Hero Fallback Component
 *
 * Lightweight gradient background for:
 * - Mobile devices (<768px)
 * - Low-end devices without WebGL
 * - SSR initial render
 * - Base layer for all devices
 *
 * Per WDI_REDESIGN_SPECIFICATION.md:
 * - Static gradient with subtle blur effects
 * - Minimal performance impact
 * - Always rendered as base layer
 */

export default function HeroFallback() {
  return (
    <>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-gray-900 to-primary-dark" />

      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Subtle glow effects - top right */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--primary-blue) 0%, transparent 70%)',
        }}
      />

      {/* Subtle glow effects - bottom left */}
      <div
        className="absolute bottom-0 left-0 w-96 h-96 opacity-15 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--primary-cyan) 0%, transparent 70%)',
        }}
      />

      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--glow-blue) 0%, transparent 70%)',
        }}
      />
    </>
  )
}
