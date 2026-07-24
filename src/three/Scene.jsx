import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { dayCycle } from '../dayCycle'
import { ridgeGeometry, visibleSize, RIDGE_LAYERS } from './geometry'

const tmpTop = new THREE.Color()
const tmpLow = new THREE.Color()
const tmpRidge = new THREE.Color()
const tmpSun = new THREE.Color()

/* ── cielo: un solo quad con degradado vertical ───────────────────── */
const makeSkyShader = () => ({
  depthTest: false,
  depthWrite: false,
  uniforms: {
    uTop: { value: new THREE.Color('#0b0e1f') },
    uLow: { value: new THREE.Color('#2e3a44') },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform vec3 uTop;
    uniform vec3 uLow;
    // ruido ordenado: rompe el banding del degradado sin costar nada
    float dither(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      float t = smoothstep(0.0, 1.0, vUv.y);
      vec3 c = mix(uLow, uTop, t);
      c += (dither(gl_FragCoord.xy) - 0.5) * 0.008;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
})

// el mismo vertex shader sirve para las tres capas: solo pasa el uv
const SKY_VERT = makeSkyShader().vertexShader

function Sky() {
  const mat = useRef()
  const { camera, size } = useThree()

  const shader = useMemo(makeSkyShader, [])
  const { w, h } = useMemo(
    () => visibleSize(camera, -48),
    [camera, size.width, size.height]
  )

  useFrame(() => {
    const p = dayCycle.palette
    mat.current.uniforms.uTop.value.set(tmpTop.set(p.skyTop))
    mat.current.uniforms.uLow.value.set(tmpLow.set(p.skyLow))
  })

  return (
    <mesh position={[0, 0, -48]} scale={[w * 1.6, h * 1.6, 1]} renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} args={[shader]} />
    </mesh>
  )
}

/* ── sol / luna: disco + halo aditivo ─────────────────────────────── */
const makeGlowShader = () => ({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uColor: { value: new THREE.Color('#c9a227') },
    uPower: { value: 1 },
  },
  vertexShader: SKY_VERT,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uPower;
    void main() {
      float d = distance(vUv, vec2(0.5)) * 2.0;
      float a = pow(clamp(1.0 - d, 0.0, 1.0), 3.2) * uPower;
      gl_FragColor = vec4(uColor, a);
    }
  `,
})

function Sun() {
  const group = useRef()
  const disc = useRef()
  const glow = useRef()
  const { camera, size } = useThree()
  const Z = -40

  const glowShader = useMemo(makeGlowShader, [])
  const { w, h } = useMemo(
    () => visibleSize(camera, Z),
    [camera, size.width, size.height]
  )

  useFrame(() => {
    const p = dayCycle.palette
    tmpSun.set(p.sun)
    disc.current.material.color.copy(tmpSun)
    glow.current.material.uniforms.uColor.value.copy(tmpSun)
    // el halo se abre al mediodia y se cierra de noche
    glow.current.material.uniforms.uPower.value = 0.35 + p.haze * 0.9
    // el sol cruza el cielo: entra por la izquierda y se pone a la derecha
    group.current.position.x = (-0.34 + dayCycle.eased * 0.72) * w
    group.current.position.y = p.sunY * h
  })

  const r = h * 0.028

  return (
    <group ref={group} position={[0, 0, Z]}>
      <mesh ref={glow} scale={[r * 26, r * 26, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial args={[glowShader]} />
      </mesh>
      <mesh ref={disc}>
        <circleGeometry args={[r, 48]} />
        <meshBasicMaterial transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

/* ── crestas ──────────────────────────────────────────────────────── */
function Ridge({ layer, index }) {
  const mesh = useRef()
  const { camera, size } = useThree()

  const geo = useMemo(
    () => ridgeGeometry({ seed: layer.seed, baseY: layer.baseY, amp: layer.amp }),
    [layer]
  )

  const { w, h } = useMemo(
    () => visibleSize(camera, layer.z),
    [camera, layer.z, size.width, size.height]
  )

  useFrame((state) => {
    const p = dayCycle.palette
    // Las capas lejanas se lavan hacia el color del cielo — perspectiva aerea.
    tmpRidge.set(p.ridge).lerp(tmpLow.set(p.skyLow), layer.tint * (0.35 + p.haze * 0.55))
    mesh.current.material.color.copy(tmpRidge)

    // Parallax real: cada capa se desplaza distinto con el scroll.
    const drift = dayCycle.eased * layer.drift
    mesh.current.position.x = -drift * w * 0.16
    mesh.current.position.y = -0.05 * h + drift * h * 0.06
    // deriva lentisima e independiente para que nunca se vea congelado
    mesh.current.position.x += Math.sin(state.clock.elapsedTime * 0.04 + index) * w * 0.004
  })

  return (
    <mesh ref={mesh} geometry={geo} position={[0, 0, layer.z]} scale={[w * 1.35, h, 1]}>
      <meshBasicMaterial />
    </mesh>
  )
}

/* ── niebla ───────────────────────────────────────────────────────── */
const makeHazeShader = () => ({
  transparent: true,
  depthWrite: false,
  uniforms: {
    uColor: { value: new THREE.Color('#efe9e1') },
    uTime: { value: 0 },
    uAmount: { value: 0.5 },
    uSeed: { value: 0 },
  },
  vertexShader: SKY_VERT,
  fragmentShader: /* glsl */ `
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uAmount;
    uniform float uSeed;

    // bandas suaves: tres senos con periodos primos, sin ruido caro
    float bands(vec2 uv) {
      float x = uv.x * 3.0 + uTime * 0.03 + uSeed;
      float f = sin(x) * 0.5 + sin(x * 2.3 + 1.7) * 0.3 + sin(x * 4.1 + 3.1) * 0.2;
      return f * 0.5 + 0.5;
    }

    void main() {
      float band = bands(vUv);
      // se acumula en el centro vertical de la capa y se disuelve arriba y abajo
      float v = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
      float a = v * (0.35 + band * 0.65) * uAmount;
      gl_FragColor = vec4(uColor, a);
    }
  `,
})

const HAZE_LAYERS = [
  { z: -30, y: 0.02, height: 0.5, seed: 0.0, speed: 1.0, weight: 0.55 },
  { z: -21, y: -0.12, height: 0.42, seed: 2.4, speed: 1.7, weight: 0.42 },
  { z: -11, y: -0.3, height: 0.34, seed: 5.1, speed: 2.6, weight: 0.3 },
]

function Haze({ layer }) {
  const mesh = useRef()
  const { camera, size } = useThree()
  const shader = useMemo(() => {
    const s = makeHazeShader()
    s.uniforms.uSeed.value = layer.seed
    return s
  }, [layer])
  const { w, h } = useMemo(
    () => visibleSize(camera, layer.z),
    [camera, layer.z, size.width, size.height]
  )

  useFrame((state) => {
    const p = dayCycle.palette
    const u = mesh.current.material.uniforms
    u.uTime.value = state.clock.elapsedTime * layer.speed
    u.uColor.value.set(tmpLow.set(p.skyLow))
    u.uAmount.value = p.haze * layer.weight
    mesh.current.position.x = -dayCycle.eased * w * 0.05 * layer.speed
  })

  return (
    <mesh
      ref={mesh}
      position={[0, layer.y * h, layer.z]}
      scale={[w * 1.5, h * layer.height, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial args={[shader]} />
    </mesh>
  )
}

/* ── camara ───────────────────────────────────────────────────────── */
function CameraRig({ reduced }) {
  const target = useRef({ x: 0, y: 0 })
  const { camera, gl, invalidate } = useThree()

  // Con reduced-motion el canvas corre en modo `demand`: no anima solo,
  // pero sigue repintandose al hacer scroll para que la hora del dia
  // avance. Congelarlo en el frame 0 seria congelarlo en la hora
  // equivocada.
  useEffect(() => {
    if (!reduced) return
    const onScroll = () => invalidate()
    window.addEventListener('scroll', onScroll, { passive: true })
    invalidate()
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced, invalidate])

  useFrame((state, dt) => {
    if (reduced) return
    const p = state.pointer
    target.current.x = p.x * 0.34
    target.current.y = p.y * 0.16 + dayCycle.eased * 0.5
    const k = 1 - Math.pow(0.002, Math.min(dt, 0.1))
    camera.position.x += (target.current.x - camera.position.x) * k
    camera.position.y += (target.current.y - camera.position.y) * k
    camera.lookAt(0, camera.position.y * 0.35, -20)
  })

  // silencia el aviso de color space en versiones viejas de three
  gl.outputColorSpace = THREE.SRGBColorSpace
  return null
}

export default function Scene({ reduced = false }) {
  return (
    <>
      <CameraRig reduced={reduced} />
      <Sky />
      <Sun />
      {HAZE_LAYERS.slice(0, 2).map((l, i) => (
        <Haze key={`h-far-${i}`} layer={l} />
      ))}
      {RIDGE_LAYERS.map((l, i) => (
        <Ridge key={l.seed} layer={l} index={i} />
      ))}
      <Haze layer={HAZE_LAYERS[2]} />
    </>
  )
}
