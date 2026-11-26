import { useCallback, useEffect, useRef, useState } from 'react'
import { Intro } from './components/Intro'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Lightbox } from './components/Lightbox'
import { SphereGallery } from './gallery/SphereGallery'
import { projects } from './data/projects'
import { StudioPage } from './components/StudioPage'
import { ContactPage } from './components/ContactPage'
import type { PageId } from './data/content'

type Phase = 'intro' | 'hero' | 'inside'

interface Selection {
  projectIndex: number
  cardIndex: number
  rect: DOMRect
  src: string
  aspect: number
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const galleryRef = useRef<SphereGallery | null>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [page, setPage] = useState<Exclude<PageId, 'projects'> | null>(null)

  useEffect(() => {
    const gallery = new SphereGallery(canvasRef.current!, projects, {
      onDive: () => setPhase('inside'),
      onSelect: (projectIndex, cardIndex, rect) => {
        gallery.setFocus(cardIndex)
        setSelection({ projectIndex, cardIndex, rect, src: gallery.imageSrc(cardIndex), aspect: gallery.cardAspect(cardIndex) })
      },
    })
    galleryRef.current = gallery
    gallery.build()
    return () => gallery.dispose()
  }, [])

  const handleIntroDone = useCallback(() => {
    setPhase('hero')
    galleryRef.current?.grow()
  }, [])

  const handleExit = () => {
    galleryRef.current?.exit()
    setPhase('hero')
  }

  const handleNavigate = (target: PageId) => {
    if (selection) return
    if (target === 'projects') {
      setPage(null)
      galleryRef.current?.setPaused(false)
      galleryRef.current?.dive()
      return
    }
    setPage(target)
    galleryRef.current?.setPaused(true)
  }

  const handlePageClosed = () => {
    setPage(null)
    galleryRef.current?.setPaused(false)
  }

  const handleClosed = () => {
    galleryRef.current?.setFocus(null)
    setSelection(null)
  }

  return (
    <main className="app">
      <canvas ref={canvasRef} className="gl" />
      <div className="vignette" />
      <Nav isVisible={phase !== 'intro'} onNavigate={handleNavigate} />
      <Hero isRevealed={phase !== 'intro'} isHidden={phase !== 'hero'} />
      <button
        type="button"
        className={`grid-btn ${phase === 'inside' && !selection && !page ? '' : 'is-hidden'}`}
        aria-label="Torna alla vista d'insieme"
        onClick={handleExit}
      >
        <i /><i /><i /><i />
      </button>
      {selection && (
        <Lightbox
          project={projects[selection.projectIndex]}
          src={selection.src}
          aspect={selection.aspect}
          from={selection.rect}
          getReturnRect={() => galleryRef.current!.cardRect(selection.cardIndex)}
          onClosed={handleClosed}
        />
      )}
      {page === 'studio' && <StudioPage onClose={handlePageClosed} />}
      {page === 'contact' && <ContactPage onClose={handlePageClosed} />}
      {phase === 'intro' && <Intro onDone={handleIntroDone} />}
    </main>
  )
}
