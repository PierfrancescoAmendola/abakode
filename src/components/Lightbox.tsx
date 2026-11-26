import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { Project } from '../data/projects'

interface LightboxProps {
  project: Project
  src: string
  aspect: number
  from: DOMRect
  getReturnRect: () => DOMRect
  onClosed: () => void
}

/** FLIP: the image starts exactly where the 3D card was on screen and flies into the panel. */
export function Lightbox({ project, src, aspect, from, getReturnRect, onClosed }: LightboxProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)

  const offsetTo = (target: DOMRect) => {
    const final = imgRef.current!.getBoundingClientRect()
    return {
      x: target.left - final.left,
      y: target.top - final.top,
      scaleX: target.width / final.width,
      scaleY: target.height / final.height,
    }
  }

  useLayoutEffect(() => {
    const img = imgRef.current!
    gsap.set(img, { transformOrigin: '0 0' })
    gsap.fromTo(img, offsetTo(from), { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1.1, ease: 'expo.inOut' })
    gsap.fromTo(
      panelRef.current!.querySelectorAll('.lb-fade'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, delay: 0.7, ease: 'power3.out' },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on open
  }, [])

  const close = () => {
    if (closingRef.current) return
    closingRef.current = true
    gsap.to(panelRef.current!.querySelectorAll('.lb-fade'), { opacity: 0, duration: 0.3 })
    gsap.to(imgRef.current!, { ...offsetTo(getReturnRect()), duration: 0.9, ease: 'expo.inOut', onComplete: onClosed })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={project.title} onClick={close}>
      <div ref={panelRef} className="lb-panel" style={{ ['--aspect' as string]: aspect }} onClick={(e) => e.stopPropagation()}>
        <div className="lb-close-wrap lb-fade">
          <button type="button" className="lb-close" onClick={close} autoFocus>
            Close
          </button>
        </div>
        <img ref={imgRef} className="lb-img" src={src} alt={project.title} />
        <div className="lb-meta lb-fade">
          <div>
            <h2 className="serif">{project.title}</h2>
            <p className="lb-place">{project.place}</p>
          </div>
          <p className="lb-story">{project.story}</p>
        </div>
      </div>
    </div>
  )
}
