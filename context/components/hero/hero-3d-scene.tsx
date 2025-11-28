"use client"

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Hero 3D Scene - Layer 1
 *
 * Per WDI_REDESIGN_SPECIFICATION.md:
 * - Rotating cube wireframes
 * - Interconnected node networks
 * - Depth parallax based on mouse movement
 * - Subtle camera orbit animation
 * - Performance: 60fps on modern devices
 * - Interactivity: Mouse movement affects rotation speed/direction
 * - Color: Subtle blue/cyan wireframes (opacity: 0.15-0.3)
 * - Size: Full viewport background
 */

interface WireframeCubeProps {
  position: [number, number, number]
  size: number
  rotationSpeed: number
  mousePosition: { x: number; y: number }
}

function WireframeCube({ position, size, rotationSpeed, mousePosition }: WireframeCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += delta * rotationSpeed * 0.2
      meshRef.current.rotation.y += delta * rotationSpeed * 0.3

      // Mouse influence on rotation
      const mouseInfluence = 0.5
      meshRef.current.rotation.x += mousePosition.y * delta * mouseInfluence
      meshRef.current.rotation.y += mousePosition.x * delta * mouseInfluence
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial
        color="#2563EB"
        wireframe
        transparent
        opacity={0.2}
      />
    </mesh>
  )
}

interface NodeNetworkProps {
  mousePosition: { x: number; y: number }
}

function NodeNetwork({ mousePosition }: NodeNetworkProps) {
  const nodesRef = useRef<THREE.Group>(null)

  // Create node positions
  const nodes = [
    [-4, 2, -2],
    [-2, -1, 1],
    [0, 3, -1],
    [2, -2, 0],
    [4, 1, -3],
    [-3, -3, 2],
    [3, 3, 1],
  ]

  useFrame((state, delta) => {
    if (nodesRef.current) {
      // Gentle orbit
      nodesRef.current.rotation.y += delta * 0.05

      // Mouse influence
      nodesRef.current.rotation.x = mousePosition.y * 0.3
      nodesRef.current.rotation.y += mousePosition.x * 0.3
    }
  })

  return (
    <group ref={nodesRef}>
      {nodes.map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color="#06B6D4"
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}

      {/* Connection lines between nearby nodes */}
      {nodes.map((pos1, i) =>
        nodes.slice(i + 1).map((pos2, j) => {
          const distance = Math.sqrt(
            Math.pow(pos1[0] - pos2[0], 2) +
            Math.pow(pos1[1] - pos2[1], 2) +
            Math.pow(pos1[2] - pos2[2], 2)
          )

          if (distance < 4) {
            const points = [
              new THREE.Vector3(pos1[0], pos1[1], pos1[2]),
              new THREE.Vector3(pos2[0], pos2[1], pos2[2]),
            ]
            const geometry = new THREE.BufferGeometry().setFromPoints(points)

            return (
              <primitive key={`${i}-${j}`} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#2563EB", transparent: true, opacity: 0.15 }))} />
            )
          }
          return null
        })
      )}
    </group>
  )
}

function Scene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse movement
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    })
  }

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />

      {/* Wireframe cubes */}
      <WireframeCube
        position={[-3, 0, -5]}
        size={2}
        rotationSpeed={0.3}
        mousePosition={mousePosition}
      />
      <WireframeCube
        position={[4, -2, -6]}
        size={1.5}
        rotationSpeed={0.5}
        mousePosition={mousePosition}
      />
      <WireframeCube
        position={[0, 3, -4]}
        size={1.2}
        rotationSpeed={0.4}
        mousePosition={mousePosition}
      />

      {/* Interconnected node network */}
      <NodeNetwork mousePosition={mousePosition} />

      {/* Subtle camera orbit */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
