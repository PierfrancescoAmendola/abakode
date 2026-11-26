import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { site } from '../data/content'

interface HeroProps {
  isRevealed: boolean
  isHidden: boolean
}

export function Hero({ isRevealed, isHidden }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isRevealed) return
    const root = rootRef.current!
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(
      root.querySelectorAll('.hero-title span'),
      { opacity: 0, y: 14, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, stagger: 0.16, ease: 'power3.out' },
    ).fromTo(
      root.querySelectorAll('.reveal'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
      '-=0.6',
    )
    return () => {
      tl.kill()
    }
  }, [isRevealed])

  return (
    <section ref={rootRef} className={`hero ${isHidden ? 'is-hidden' : ''}`} aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title serif">
        {site.title.split(' ').map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </h1>
      <div className="bio">
        <img className="bio-logo reveal" src="/logo.svg" alt={site.owner} width={643} height={158} />
        <p className="reveal">{site.bio}</p>
      </div>
      <p className="copy reveal">
        {site.owner} © {site.year}.
      </p>
    </section>
  )
}
