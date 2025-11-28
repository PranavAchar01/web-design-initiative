"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Hero Morphing Blobs - Layer 3
 *
 * Per WDI_REDESIGN_SPECIFICATION.md:
 * - 2-3 large blob shapes
 * - Smooth morphing between states (5-8 second cycles)
 * - Cursor-proximity distortion
 * - Blur/glow effects
 * - Shape Size: 300-600px diameter
 * - Blur Amount: 40-80px
 * - Opacity: 0.1-0.2
 * - Colors: Blue/cyan with subtle glow
 * - Position: Behind text, asymmetric placement
 */

// Multiple blob shape variations for morphing
const BLOB_SHAPES = {
  blob1: [
    "M60,-65C75.9,-54.4,85.9,-33.4,87.3,-11.9C88.7,9.6,81.5,31.6,68.3,48.3C55.1,65,36,76.4,15.9,79.9C-4.2,83.4,-25.2,79,-41.8,67.8C-58.4,56.6,-70.6,38.6,-75.4,18.8C-80.2,-1,-77.6,-22.6,-67.8,-39.4C-58,-56.2,-40.9,-68.2,-22.4,-72.8C-3.9,-77.4,16,-74.6,33.6,-71.4C51.2,-68.2,66.5,-64.6,60,-65Z",
    "M54.3,-63.5C69.7,-53.1,81.2,-34.3,84.5,-14.2C87.8,5.9,82.9,27.3,71.5,44.3C60.1,61.3,42.2,73.9,22.7,78.9C3.2,83.9,-17.9,81.3,-36.4,73.1C-54.9,64.9,-70.8,51.1,-77.4,33.8C-84,16.5,-81.3,-4.3,-74.1,-22.6C-66.9,-40.9,-55.2,-56.7,-40.3,-67.3C-25.4,-77.9,-7.2,-83.3,9.4,-84.1C26,-84.9,38.9,-73.9,54.3,-63.5Z",
    "M49.7,-58.5C63.5,-48.2,73.3,-31.7,76.8,-13.7C80.3,4.3,77.5,23.8,68.4,39.4C59.3,55,43.9,66.7,26.3,72.3C8.7,77.9,-11.1,77.4,-28.4,71.1C-45.7,64.8,-60.5,52.7,-68.9,37.1C-77.3,21.5,-79.3,2.4,-75.8,-15.3C-72.3,-33,-63.3,-49.3,-49.9,-59.8C-36.5,-70.3,-18.2,-75,0.1,-75.1C18.4,-75.2,36.8,-68.8,49.7,-58.5Z",
  ],
  blob2: [
    "M47.1,-53.8C60.3,-43.2,69.5,-27.4,72.4,-10.3C75.3,6.8,71.9,25.2,62.4,39.8C52.9,54.4,37.3,65.2,19.8,70.7C2.3,76.2,-17.1,76.4,-34.2,70C-51.3,63.6,-66,50.6,-73.3,34.2C-80.6,17.8,-80.5,-2,-74.1,-19.4C-67.7,-36.8,-55,-51.8,-39.8,-61.9C-24.6,-72,-7.9,-77.2,7.3,-76.1C22.5,-75,33.9,-64.4,47.1,-53.8Z",
    "M41.5,-48.9C53.7,-39.5,63.3,-25.4,66.8,-9.8C70.3,5.8,67.7,22.9,59.4,36.6C51.1,50.3,37.1,60.6,21.3,66.2C5.5,71.8,-12.1,72.7,-28,67.8C-43.9,62.9,-58.1,52.2,-65.8,37.6C-73.5,23,-74.7,4.5,-71.3,-12.8C-67.9,-30.1,-59.9,-46.2,-47.5,-55.5C-35.1,-64.8,-18.6,-67.3,-2.4,-64.5C13.8,-61.7,29.3,-58.3,41.5,-48.9Z",
    "M52.4,-60.7C66.8,-50.3,76.9,-32.7,79.8,-14C82.7,4.7,78.4,24.5,68.3,40.1C58.2,55.7,42.3,67.1,24.8,72.3C7.3,77.5,-11.8,76.5,-28.9,70.2C-46,63.9,-61.1,52.3,-69.7,36.9C-78.3,21.5,-80.4,2.3,-76.8,-15.2C-73.2,-32.7,-64,-48.5,-50.3,-59C-36.6,-69.5,-19.3,-74.7,-0.9,-73.6C17.5,-72.5,38,-60.1,52.4,-60.7Z",
  ],
  blob3: [
    "M44.7,-51.5C57.1,-41.3,66.1,-26.3,69.4,-9.9C72.7,6.5,70.3,24.3,61.5,38.3C52.7,52.3,37.5,62.5,20.7,67.8C3.9,73.1,-14.5,73.5,-30.5,67.7C-46.5,61.9,-60.1,49.9,-67.4,34.7C-74.7,19.5,-75.7,1.1,-71.9,-15.7C-68.1,-32.5,-59.5,-47.7,-47.1,-57.9C-34.7,-68.1,-18.4,-73.3,-1.2,-71.8C16,-70.3,32.3,-61.7,44.7,-51.5Z",
    "M39.8,-45.6C51.5,-36.2,60.5,-23.3,64.8,-8.4C69.1,6.5,68.7,23.4,61.2,37.6C53.7,51.8,39.1,63.3,22.8,68.7C6.5,74.1,-11.5,73.4,-27.5,67.4C-43.5,61.4,-57.5,50.1,-64.8,35.3C-72.1,20.5,-72.7,2.2,-68.7,-14.5C-64.7,-31.2,-56.1,-46.3,-43.8,-55.5C-31.5,-64.7,-14.7,-68,0.1,-68.1C14.9,-68.2,28.1,-55.1,39.8,-45.6Z",
    "M50.3,-58.9C64.4,-48.5,74.4,-31.4,77.4,-13C80.4,5.4,76.4,25.1,66.5,40.4C56.6,55.7,40.8,66.6,23.3,71.9C5.8,77.2,-13.4,77,-30.4,71C-47.4,65,-62.2,53.2,-69.8,37.8C-77.4,22.4,-77.8,3.4,-73.8,-14.1C-69.8,-31.6,-61.4,-47.6,-48.5,-58.2C-35.6,-68.8,-18.8,-73.9,0.1,-74C19,-74.1,36.2,-69.3,50.3,-58.9Z",
  ],
}

interface BlobProps {
  paths: string[]
  size: number
  x: string
  y: string
  color: string
  blur: number
  opacity: number
  duration: number
}

function Blob({ paths, size, x, y, color, blur, opacity, duration }: BlobProps) {
  const [pathIndex, setPathIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Cycle through blob shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((prev) => (prev + 1) % paths.length)
    }, duration)

    return () => clearInterval(interval)
  }, [paths.length, duration])

  // Track mouse position for proximity distortion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      animate={{
        x: [0, 20, -20, 0],
        y: [0, -20, 20, 0],
      }}
      transition={{
        duration: duration / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.path
          fill={color}
          d={paths[pathIndex]}
          transform="translate(100 100)"
          animate={{ d: paths[pathIndex] }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  )
}

export default function HeroBlobs() {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden">
      {/* Blob 1: Top-right, blue */}
      <Blob
        paths={BLOB_SHAPES.blob1}
        size={500}
        x="60%"
        y="10%"
        color="rgba(37, 99, 235, 0.15)"
        blur={60}
        opacity={0.2}
        duration={7000}
      />

      {/* Blob 2: Bottom-left, cyan */}
      <Blob
        paths={BLOB_SHAPES.blob2}
        size={450}
        x="5%"
        y="60%"
        color="rgba(6, 182, 212, 0.12)"
        blur={50}
        opacity={0.15}
        duration={8000}
      />

      {/* Blob 3: Center-right, blue glow */}
      <Blob
        paths={BLOB_SHAPES.blob3}
        size={400}
        x="70%"
        y="50%"
        color="rgba(37, 99, 235, 0.1)"
        blur={70}
        opacity={0.1}
        duration={6000}
      />
    </div>
  )
}
