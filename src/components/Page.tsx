import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

interface PageProps {
  label: string
  onClose: () => void
  children: ReactNode
}

/** Full-screen panel over the dimmed sphere (Studio, Contatti). Children with `.pg-fade` stagger in. */
export function Page({ label, onClose, children }: PageProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current!
    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    gsap.fromTo(
      root.querySelectorAll('.pg-fade'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, delay: 0.15, ease: 'power3.out' },
    )
  }, [])

  const close = () => gsap.to(rootRef.current!, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: onClose })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div ref={rootRef} className="page" role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" className="lb-close page-close" onClick={close} autoFocus>
        Close
      </button>
      <div className="page-inner">{children}</div>
    </div>
  )
}
