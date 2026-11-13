// FloatingSymbols3D.tsx
import { useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text3D, Center } from "@react-three/drei"
import * as THREE from "three"
import FONT_DATA from "three/examples/fonts/helvetiker_bold.typeface.json"


function CodeSymbol({
  text,
  position,
  color,
  floatSpeed = 1,
  floatIntensity = 1.5,
  rotationSpeed = 0.4,
}: {
  text: string
  position: [number, number, number]
  color: string
  floatSpeed?: number
  floatIntensity?: number
  rotationSpeed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={floatIntensity} position={position}>
      <group ref={groupRef}>
        <Center>
          <Text3D
            font={FONT_DATA as unknown as string}
            size={0.64}
            height={0.20}
            curveSegments={8}
            bevelEnabled
            bevelThickness={0.018}
            bevelSize={0.012}
            bevelSegments={3}
          >
            {text}
            <meshStandardMaterial
              color={color}
              metalness={0.5}
              roughness={0.2}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  )
}


function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} />
      <pointLight position={[-3, 2, 3]} color="#7c3aed" intensity={3} />
      <pointLight position={[3, -2, 3]} color="#2563eb" intensity={2} />

      <Suspense fallback={null}>
        <CodeSymbol text="@"    position={[-1.8,  1.4, 0]} color="#7c3aed" floatSpeed={1.4} rotationSpeed={0.5} />
        <CodeSymbol text="</>"  position={[ 1.6, 1.9, 0]} color="#2563eb" floatSpeed={0.9} rotationSpeed={0.3} />
        {/* <CodeSymbol text="{ }"   position={[-2.0, -0.2, 0]} color="#059669" floatSpeed={1.1} rotationSpeed={0.6} /> */}
        <CodeSymbol text="#"    position={[ 1.9, -0.8, 0]} color="#059669" floatSpeed={1.6} rotationSpeed={0.4} />
        {/* <CodeSymbol text="fn()" position={[-1.4, -1.6, 0]} color="#db2777" floatSpeed={1.0} rotationSpeed={0.35} floatIntensity={1.2} /> */}
      </Suspense>
    </>
  )
}

export function FloatingSymbols3D() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}