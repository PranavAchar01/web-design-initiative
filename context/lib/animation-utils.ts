/**
 * Animation capability detection utilities
 * Detects device capabilities for progressive enhancement
 */

export interface AnimationCapabilities {
  advanced: boolean
  webgl: boolean
  reducedMotion: boolean
}

/**
 * Detects animation capabilities for progressive enhancement
 * @returns Object containing capability flags
 */
export function detectAnimationCapabilities(): AnimationCapabilities {
  // Server-side or no window - return conservative defaults
  if (typeof window === 'undefined') {
    return {
      advanced: false,
      webgl: false,
      reducedMotion: true,
    }
  }

  // Check for reduced motion preference
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Check WebGL support
  const webgl = detectWebGL()

  // Check for advanced animation support
  // Based on: hardware capability, network quality, viewport size
  const advanced = detectAdvancedCapabilities()

  return {
    advanced,
    webgl,
    reducedMotion,
  }
}

/**
 * Detects WebGL support
 * @returns true if WebGL is available
 */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

/**
 * Detects advanced animation capabilities
 * Checks hardware, network, and viewport
 * @returns true if device can handle advanced animations
 */
function detectAdvancedCapabilities(): boolean {
  // Check hardware concurrency (CPU cores)
  const hasSufficientCPU = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency >= 4
    : true // Assume true if not available

  // Check device memory (if available)
  const hasSufficientMemory = (navigator as any).deviceMemory
    ? (navigator as any).deviceMemory >= 4
    : true // Assume true if not available

  // Check connection quality (if available)
  const hasGoodConnection = checkConnectionQuality()

  // Check if device is likely mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Advanced animations enabled if:
  // - Sufficient hardware (CPU + memory)
  // - Good connection
  // - Not on mobile (or sufficient specs on mobile)
  return hasSufficientCPU && hasSufficientMemory && hasGoodConnection && !isMobile
}

/**
 * Checks network connection quality
 * @returns true if connection is good enough for advanced animations
 */
function checkConnectionQuality(): boolean {
  // If Network Information API is available
  if ('connection' in navigator) {
    const conn = (navigator as any).connection

    // Slow connections - disable advanced animations
    if (conn.saveData) return false
    if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      return false
    }

    // Good connections
    if (conn.effectiveType === '4g' || conn.effectiveType === '5g') {
      return true
    }
  }

  // Default to true if we can't detect
  return true
}

/**
 * Gets optimal particle count based on viewport and capabilities
 * @param capabilities - Detected animation capabilities
 * @returns Recommended particle count
 */
export function getParticleCount(capabilities: AnimationCapabilities): number {
  if (!capabilities.webgl || capabilities.reducedMotion) {
    return 0
  }

  const width = window.innerWidth

  // Desktop
  if (width >= 1920) {
    return capabilities.advanced ? 300 : 200
  }

  // Laptop
  if (width >= 1280) {
    return capabilities.advanced ? 200 : 150
  }

  // Tablet
  if (width >= 768) {
    return capabilities.advanced ? 150 : 100
  }

  // Mobile
  return 0
}
