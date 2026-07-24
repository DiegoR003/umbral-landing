import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

const isLowEnd = () =>
  typeof navigator !== 'undefined' &&
  ((navigator.hardwareConcurrency || 8) <= 4 || /Mobi|Android/i.test(navigator.userAgent))

/**
 * Modulo aislado a proposito: todo three.js entra por aqui y solo se
 * descarga cuando `Sky` decide montarlo, ya pasado el primer render.
 */
export default function SkyCanvas({ reduced }) {
  const low = isLowEnd()
  return (
    <Canvas
      dpr={[1, low ? 1.25 : 1.6]}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 32, near: 0.1, far: 200, position: [0, 0, 6] }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Scene reduced={reduced} />
    </Canvas>
  )
}
