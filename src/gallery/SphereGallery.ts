import * as THREE from 'three'
import gsap from 'gsap'
import type { Project } from '../data/projects'
import { canvasTexture, drawPlaceholder } from './cardTexture'
import { cardFragment, cardVertex } from './cardShader'
import { Cosmos } from './Cosmos'
import { scatterProjects } from './scatter'

export const CARD_COUNT = 88
const RADIUS = 10
const CARD_WIDTH = 1.75
const OUTSIDE_Z = 30
const HERO_FOV = 40
const INSIDE_FOV = 50
const AUTO_SPIN = 0.06
const DRAG_THRESHOLD = 5
const MAX_PITCH = 0.7
const INPUT_DELAY = 1.6
const BG_COLOR = 0x0e0c0b

export type GalleryMode = 'hero' | 'inside'

interface Callbacks {
  onDive: () => void
  onSelect: (projectIndex: number, cardIndex: number, rect: DOMRect) => void
}

interface Card {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  projectIndex: number
  canvas?: HTMLCanvasElement
}

export class SphereGallery {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(HERO_FOV, 1, 0.05, 400)
  private group = new THREE.Group()
  private cards: Card[] = []
  private raycaster = new THREE.Raycaster()
  private clock = new THREE.Clock()
  private mode: GalleryMode = 'hero'
  private enabled = false
  private frozen = false
  private yaw = 0
  private pitch = 0
  private targetYaw = 0
  private targetPitch = 0
  // The globe spinning on its own axis; unlike user rotation it doesn't move the observer.
  private spin = 0
  private drag = { active: false, x: 0, y: 0, moved: 0 }
  private raf = 0
  private cosmos: Cosmos

  constructor(private canvas: HTMLCanvasElement, private projects: Project[], private cb: Callbacks) {
    // Opaque canvas: additive glow (stars) is lost on a transparent framebuffer.
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setClearColor(BG_COLOR)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.cosmos = new Cosmos(this.renderer.getPixelRatio())
    this.scene.add(this.cosmos.root)
    this.scene.add(this.group)
    this.group.scale.setScalar(0.001)
    this.resize()
    this.bind()
    this.loop()
  }

  /** Builds cards once webfonts are ready so placeholder art uses the right typefaces. */
  async build(): Promise<void> {
    await document.fonts.ready
    const golden = Math.PI * (3 - Math.sqrt(5))
    const geometry = new THREE.PlaneGeometry(1, 1)
    const points = Array.from({ length: CARD_COUNT }, (_, i) => {
      const y = 1 - (i / (CARD_COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      return new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(RADIUS)
    })
    const assignment = scatterProjects(points, this.projects.length)
    for (let i = 0; i < CARD_COUNT; i++) {
      const projectIndex = assignment[i]
      const project = this.projects[projectIndex]
      const aspect = project.aspect ?? 1.5
      const material = new THREE.ShaderMaterial({
        vertexShader: cardVertex,
        fragmentShader: cardFragment,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: { uMap: { value: null }, uOpacity: { value: 1 }, uDim: { value: 1 } },
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(points[i])
      mesh.lookAt(0, 0, 0)
      mesh.scale.set(CARD_WIDTH, CARD_WIDTH / aspect, 1)
      const card: Card = { mesh, projectIndex }
      this.applyTexture(card, project, i)
      this.cards.push(card)
      this.group.add(mesh)
    }
  }

  private applyTexture(card: Card, project: Project, index: number) {
    const uniforms = card.mesh.material.uniforms
    if (!project.image) {
      card.canvas = drawPlaceholder(project, index)
      uniforms.uMap.value = canvasTexture(card.canvas)
      return
    }
    new THREE.TextureLoader().load(
      project.image,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        const img = tex.image as HTMLImageElement
        card.mesh.scale.y = CARD_WIDTH / (img.width / img.height)
        uniforms.uMap.value = tex
      },
      undefined,
      () => {
        // Missing image: fall back to placeholder art instead of an empty card.
        card.canvas = drawPlaceholder(project, index)
        uniforms.uMap.value = canvasTexture(card.canvas)
      },
    )
  }

  imageSrc(cardIndex: number): string {
    const card = this.cards[cardIndex]
    return card.canvas ? card.canvas.toDataURL('image/jpeg', 0.9) : this.projects[card.projectIndex].image!
  }

  cardAspect(cardIndex: number): number {
    const { x, y } = this.cards[cardIndex].mesh.scale
    return x / y
  }

  /** Sphere grows out of the dark after the intro. */
  grow() {
    // Delay input so trackpad momentum from the intro scroll doesn't dive straight into the sphere.
    gsap.delayedCall(INPUT_DELAY, () => { this.enabled = true })
    gsap.fromTo(this.group.scale, { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 2.6, ease: 'expo.out' })
    gsap.from(this, { spin: -1.2, duration: 2.6, ease: 'expo.out' })
  }

  dive() {
    if (this.mode === 'inside') return
    this.mode = 'inside'
    this.targetPitch = 0
    gsap.to(this.camera.position, { z: 0.001, duration: 2, ease: 'power3.inOut' })
    this.tweenFov(INSIDE_FOV, 2)
    this.cb.onDive()
  }

  exit() {
    if (this.mode === 'hero') return
    this.mode = 'hero'
    this.targetPitch = 0
    gsap.to(this.camera.position, { z: this.outsideZ(), duration: 1.8, ease: 'power3.inOut' })
    this.tweenFov(HERO_FOV, 1.8)
  }

  setFocus(cardIndex: number | null) {
    this.frozen = cardIndex !== null
    this.cards.forEach((card, i) => {
      const u = card.mesh.material.uniforms
      u.uOpacity.value = i === cardIndex ? 0 : 1
      gsap.to(u.uDim, { value: cardIndex === null ? 1 : 0.35, duration: 0.8 })
    })
  }

  /** Freezes and dims the sphere under a full-screen page; -1 hides no card. */
  setPaused(paused: boolean) {
    this.setFocus(paused ? -1 : null)
  }

  /** Screen-space bounding box of a card (used to fly it into the lightbox and back). */
  cardRect(cardIndex: number): DOMRect {
    const mesh = this.cards[cardIndex].mesh
    const { width, height } = this.canvas.getBoundingClientRect()
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    const v = new THREE.Vector3()
    for (const [cx, cy] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]) {
      v.set(cx, cy, 0)
      mesh.localToWorld(v).project(this.camera)
      const x = ((v.x + 1) / 2) * width
      const y = ((1 - v.y) / 2) * height
      minX = Math.min(minX, x); maxX = Math.max(maxX, x)
      minY = Math.min(minY, y); maxY = Math.max(maxY, y)
    }
    return new DOMRect(minX, minY, maxX - minX, maxY - minY)
  }

  private tweenFov(fov: number, duration: number) {
    gsap.to(this.camera, { fov, duration, ease: 'power3.inOut', onUpdate: () => this.camera.updateProjectionMatrix() })
  }

  private outsideZ() {
    // Portrait screens need more distance so the sphere fits the width.
    return OUTSIDE_Z / Math.min(this.camera.aspect, 1)
  }

  private resize = () => {
    const w = window.innerWidth, h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    if (this.mode === 'hero') this.camera.position.z = this.outsideZ()
    this.camera.updateProjectionMatrix()
  }

  private onDown = (e: PointerEvent) => {
    if (!this.enabled || this.frozen) return
    this.drag = { active: true, x: e.clientX, y: e.clientY, moved: 0 }
    this.canvas.setPointerCapture(e.pointerId)
  }

  private onMove = (e: PointerEvent) => {
    if (!this.drag.active) return
    const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y
    this.drag.x = e.clientX
    this.drag.y = e.clientY
    this.drag.moved += Math.abs(dx) + Math.abs(dy)
    const k = this.mode === 'inside' ? -0.004 : 0.005
    this.targetYaw += dx * k
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + dy * k * 0.8, -MAX_PITCH, MAX_PITCH)
  }

  private onUp = (e: PointerEvent) => {
    if (!this.drag.active) return
    this.drag.active = false
    if (this.drag.moved > DRAG_THRESHOLD) return
    if (this.mode === 'hero') return this.dive()
    this.pick(e)
  }

  private pick(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect()
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const hit = this.raycaster.intersectObjects(this.cards.map((c) => c.mesh))[0]
    if (!hit) return
    const cardIndex = this.cards.findIndex((c) => c.mesh === hit.object)
    this.cb.onSelect(this.cards[cardIndex].projectIndex, cardIndex, this.cardRect(cardIndex))
  }

  private onWheel = (e: WheelEvent) => {
    if (!this.enabled || this.frozen) return
    if (this.mode === 'hero') {
      if (e.deltaY > 0) this.dive()
      return
    }
    this.targetYaw += (e.deltaY + e.deltaX) * 0.0015
  }

  private bind() {
    window.addEventListener('resize', this.resize)
    window.addEventListener('wheel', this.onWheel, { passive: true })
    this.canvas.addEventListener('pointerdown', this.onDown)
    this.canvas.addEventListener('pointermove', this.onMove)
    this.canvas.addEventListener('pointerup', this.onUp)
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    if (!this.frozen) {
      if (this.mode === 'hero' && !this.drag.active) this.spin += dt * AUTO_SPIN
      this.yaw += (this.targetYaw - this.yaw) * 0.06
      this.pitch += (this.targetPitch - this.pitch) * 0.06
      this.group.rotation.set(this.pitch, this.yaw + this.spin, 0)
      // User rotation = the observer orbiting, so the whole backdrop turns with it.
      this.cosmos.root.rotation.set(this.pitch, this.yaw, 0)
    }
    this.cosmos.update(this.clock.elapsedTime)
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('pointerdown', this.onDown)
    this.canvas.removeEventListener('pointermove', this.onMove)
    this.canvas.removeEventListener('pointerup', this.onUp)
    this.cards.forEach((c) => {
      c.mesh.material.uniforms.uMap.value?.dispose()
      c.mesh.material.dispose()
    })
    this.cards[0]?.mesh.geometry.dispose()
    this.cosmos.dispose()
    this.renderer.dispose()
  }
}
