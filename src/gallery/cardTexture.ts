import * as THREE from 'three'
import type { Project } from '../data/projects'

const BASE_WIDTH = 768

// Muted, photographic-feeling hue pairs so placeholders read like real images on the dark sphere.
const PALETTE: [string, string][] = [
  ['#1f3a2b', '#7a8f4a'],
  ['#2a2320', '#b07a45'],
  ['#14262e', '#4f8a9a'],
  ['#2b1d1d', '#a4574a'],
  ['#232323', '#8c8c86'],
  ['#1c2a1a', '#c2b06a'],
  ['#1b1f2c', '#6f7fb0'],
]

/** Draws placeholder art for a project without an image. */
export function drawPlaceholder(project: Project, index: number): HTMLCanvasElement {
  const aspect = project.aspect ?? 1.5
  const canvas = document.createElement('canvas')
  canvas.width = BASE_WIDTH
  canvas.height = Math.round(BASE_WIDTH / aspect)
  const ctx = canvas.getContext('2d')!
  const { width: w, height: h } = canvas
  const [dark, light] = PALETTE[index % PALETTE.length]

  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, dark)
  bg.addColorStop(1, light)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const glow = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.7)
  glow.addColorStop(0, 'rgba(255,255,255,0.28)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = `400 ${Math.round(h * 0.22)}px "Noto Serif Display", serif`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(String((index % 99) + 1).padStart(2, '0'), w * 0.06, h * 0.9)
  ctx.font = `400 ${Math.round(w * 0.04)}px Geist, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(project.title.toUpperCase(), w * 0.06, h * 0.13)
  return canvas
}

export function canvasTexture(canvas: HTMLCanvasElement): THREE.Texture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
