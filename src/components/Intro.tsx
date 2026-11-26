import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { introFragment, introVertex } from './introShader'

const INTRO_SECONDS = 5
// Last stretch dissolves the intro's stars into the site's starfield underneath.
const FADE_FROM = 4.45
// Total wheel distance (px) to travel from the eye to black.
const SCROLL_LENGTH = 3400
const KEY_STEP = 220
const SMOOTHING = 0.08
const END_EPSILON = 0.02

interface IntroProps {
  onDone: () => void
}

/** Scroll-scrubbed zoom: close-up eye → through the pupil → aerial forest around a dark hole → black. */
export function Intro({ onDone }: IntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const iris = new THREE.TextureLoader().load('/iris.jpg')
    iris.minFilter = THREE.LinearMipmapLinearFilter
    iris.anisotropy = 8
    const uniforms = {
      uRes: { value: new THREE.Vector2() },
      uT: { value: 0 },
      uTime: { value: 0 },
      uIris: { value: iris },
    }
    const clock = new THREE.Clock()
    const material = new THREE.ShaderMaterial({ vertexShader: introVertex, fragmentShader: introFragment, uniforms })
    const scene = new THREE.Scene()
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false)
      renderer.getDrawingBufferSize(uniforms.uRes.value)
    }
    resize()

    let target = 0
    const advance = (px: number) => {
      target = THREE.MathUtils.clamp(target + (px / SCROLL_LENGTH) * INTRO_SECONDS, 0, INTRO_SECONDS)
    }
    const onWheel = (e: WheelEvent) => advance(e.deltaY)
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      advance((touchY - e.touches[0].clientY) * 2)
      touchY = e.touches[0].clientY
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) advance(KEY_STEP)
      if (['ArrowUp', 'PageUp'].includes(e.key)) advance(-KEY_STEP)
    }

    let raf = 0
    let finished = false
    const loop = () => {
      raf = requestAnimationFrame(loop)
      uniforms.uT.value += (target - uniforms.uT.value) * SMOOTHING
      uniforms.uTime.value = clock.getElapsedTime()
      canvas.style.opacity = String(1 - THREE.MathUtils.smoothstep(uniforms.uT.value, FADE_FROM, INTRO_SECONDS))
      renderer.render(scene, camera)
      if (!finished && uniforms.uT.value > INTRO_SECONDS - END_EPSILON) {
        finished = true
        onDone()
      }
    }
    loop()

    window.addEventListener('resize', resize)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      material.dispose()
      iris.dispose()
      renderer.dispose()
    }
  }, [onDone])

  return <canvas ref={canvasRef} className="intro" aria-label="Scorri per entrare" />
}
