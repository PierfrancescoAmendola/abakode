import * as THREE from 'three'

const NEIGHBOURS = 8
const SEED = 1337

// Small seeded PRNG so the layout is random but identical on every visit.
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Assigns a project to every card point: each project appears about equally often, in random order,
 * and no card shows the same project as any of its nearest neighbours on the sphere.
 */
export function scatterProjects(points: THREE.Vector3[], projectCount: number): number[] {
  const rand = mulberry32(SEED)
  const bag = points.map((_, i) => i % projectCount)
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }

  const neighbours = points.map((p, i) =>
    points
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBOURS)
      .map(({ j }) => j),
  )
  const clashes = (i: number, project: number) => neighbours[i].some((n) => bag[n] === project)

  // Repair pass: swap any clashing card with one elsewhere where both end up clash-free.
  for (let pass = 0; pass < 5; pass++) {
    let fixed = true
    for (let i = 0; i < bag.length; i++) {
      if (!clashes(i, bag[i])) continue
      fixed = false
      for (let j = 0; j < bag.length; j++) {
        if (bag[j] === bag[i]) continue
        const [a, b] = [bag[i], bag[j]]
        bag[i] = b
        bag[j] = a
        if (!clashes(i, b) && !clashes(j, a)) break
        bag[i] = a
        bag[j] = b
      }
    }
    if (fixed) break
  }
  return bag
}
