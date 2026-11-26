import { useState } from 'react'
import { site, type PageId } from '../data/content'

interface NavProps {
  isVisible: boolean
  onNavigate: (page: PageId) => void
}

export function Nav({ isVisible, onNavigate }: NavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const go = (page: PageId) => {
    setIsOpen(false)
    onNavigate(page)
  }
  return (
    <>
      <header className={`nav ${isVisible ? '' : 'is-hidden'}`}>
        <button type="button" className="menu-btn" aria-expanded={isOpen} onClick={() => setIsOpen((o) => !o)}>
          <span className="menu-row">
            {isOpen ? 'Close' : 'Menu'}
            <i />
          </span>
          <i />
          <i />
        </button>
      </header>
      <nav className={`menu ${isOpen ? 'is-open' : ''}`} aria-label="Menu principale" aria-hidden={!isOpen}>
        {site.menu.map((item) => (
          <button key={item.id} type="button" className="serif" tabIndex={isOpen ? 0 : -1} onClick={() => go(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  )
}
