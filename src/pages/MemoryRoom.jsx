import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'

const IMAGES = [
  { id: 'p1', src: '/WhatsApp Image 2025-08-17 at 1.38.47 AM.jpeg', story: 'قصة الصورة 1' },
  { id: 'p2', src: '/WhatsApp Image 2025-08-17 at 1.38.55 AM.jpeg', story: 'قصة الصورة 2' },
  { id: 'p3', src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM (1).jpeg', story: 'قصة الصورة 3' },
  { id: 'p4', src: '/WhatsApp Image 2025-08-17 at 1.38.56 AM.jpeg', story: 'قصة الصورة 4' },
  { id: 'p5', src: '/WhatsApp Image 2025-08-17 at 1.38.57 AM.jpeg', story: 'قصة الصورة 5' },
  { id: 'p6', src: '/WhatsApp Image 2025-08-17 at 1.39.00 AM.jpeg', story: 'قصة الصورة 6' },
  { id: 'p7', src: '/WhatsApp Image 2025-08-17 at 1.39.01 AM.jpeg', story: 'قصة الصورة 7' },
  { id: 'p8', src: '/WhatsApp Image 2025-08-17 at 1.39.02 AM.jpeg', story: 'قصة الصورة 8' },
  { id: 'p9', src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM (1).jpeg', story: 'قصة الصورة 9' },
  { id: 'p10', src: '/WhatsApp Image 2025-08-17 at 1.39.04 AM.jpeg', story: 'قصة الصورة 10' },
  { id: 'p11', src: '/WhatsApp Image 2025-08-17 at 1.39.05 AM.jpeg', story: 'قصة الصورة 11' },
  { id: 'p12', src: '/WhatsApp Image 2025-08-17 at 1.39.06 AM.jpeg', story: 'قصة الصورة 12' }
]

function ParticleImages({ images, onSelect }) {
  const group = useRef()
  const textures = useTexture(images.map(img => img.src))

  useFrame(({ clock }) => {
    group.current?.children.forEach((mesh, i) => {
      mesh.position.x += Math.sin(clock.elapsedTime + i) * 0.002
      mesh.position.y += Math.cos(clock.elapsedTime * 0.5 + i) * 0.002
      mesh.position.z += Math.sin(clock.elapsedTime * 0.3 + i) * 0.002
    })
  })

  return (
    <group ref={group}>
      {textures.map((tex, idx) => (
        <mesh key={idx} position={[(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 8]} onClick={() => onSelect(images[idx])}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial map={tex} toneMapped />
        </mesh>
      ))}
    </group>
  )
}

function CameraRig({ target }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.05
    camera.position.y += (target.current.y - camera.position.y) * 0.05
    camera.position.z += (target.current.z - camera.position.z) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function MemoryRoomPage() {
  const [activeImage, setActiveImage] = useState(null)
  const cameraTarget = useRef({ x: 0, y: 0, z: 10 })

  const openImage = (img) => {
    setActiveImage(img)
    cameraTarget.current = { x: 0, y: 0, z: 2 }
  }

  const closeOverlay = () => {
    setActiveImage(null)
    cameraTarget.current = { x: 0, y: 0, z: 10 }
  }

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} className="h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Suspense fallback={null}>
          <ParticleImages images={IMAGES} onSelect={openImage} />
          <CameraRig target={cameraTarget} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>

      {activeImage && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-2">
          <div className="absolute inset-0 bg-black/60" onClick={closeOverlay} />
          <div className="overflow-hidden relative w-full max-w-md bg-black rounded-xl shadow-2xl">
            <button onClick={closeOverlay} className="absolute top-2 right-2 z-50 p-2 text-white rounded-full bg-black/80">✕</button>
            <img src={activeImage.src} alt="" className="object-cover w-full h-screen" />
          </div>
        </div>
      )}
    </div>
  )
}
