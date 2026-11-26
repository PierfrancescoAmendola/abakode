import { contact } from '../data/content'
import { Page } from './Page'

interface ContactPageProps {
  onClose: () => void
}

export function ContactPage({ onClose }: ContactPageProps) {
  return (
    <Page label={contact.eyebrow} onClose={onClose}>
      <p className="pg-eyebrow pg-fade">{contact.eyebrow}</p>
      <h2 className="pg-title serif pg-fade">{contact.title}</h2>
      <p className="pg-lead pg-fade">{contact.intro}</p>
      <a className="pg-mail serif pg-fade" href={`mailto:${contact.email}`}>
        {contact.email}
        <span aria-hidden="true">↗</span>
      </a>
      <div className="pg-footer">
        <div className="pg-fade">
          <small>Dove siamo</small>
          <span>{contact.city}</span>
        </div>
        <div className="pg-links pg-fade">
          <small>Seguici</small>
          {contact.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </Page>
  )
}
