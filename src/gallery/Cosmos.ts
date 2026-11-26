import * as THREE from 'three'

const STAR_COUNT = 3200
const STAR_MIN_R = 55
const STAR_MAX_R = 150

const starVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
uniform float uTime;
uniform float uPixelRatio;
varying float vTwinkle;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);
  gl_PointSize = aSize * uPixelRatio * (220.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

const starFragment = /* glsl */ `
varying float vTwinkle;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(1.0, 0.97, 0.92), pow(core, 2.2) * vTwinkle);
}
`

/** Deep-space backdrop: twinkling stars. */
export class Cosmos {
  readonly root = new THREE.Group()
  private uniforms = { uTime: { value: 0 }, uPixelRatio: { value: 1 } }
  private geometry = new THREE.BufferGeometry()
  private material: THREE.ShaderMaterial

  constructor(pixelRatio: number) {
    this.uniforms.uPixelRatio.value = pixelRatio
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const phases = new Float32Array(STAR_COUNT)
    for (let i = 0; i < STAR_COUNT; i++) {
      new THREE.Vector3().randomDirection().multiplyScalar(THREE.MathUtils.randFloat(STAR_MIN_R, STAR_MAX_R)).toArray(positions, i * 3)
      // Mostly tiny stars, a few bright ones.
      sizes[i] = Math.random() < 0.04 ? THREE.MathUtils.randFloat(3, 5) : THREE.MathUtils.randFloat(0.8, 2.2)
      phases[i] = Math.random()
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    this.geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    this.material = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(this.geometry, this.material)
    stars.renderOrder = -1
    this.root.add(stars)
  }

  update(time: number) {
    this.uniforms.uTime.value = time
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
