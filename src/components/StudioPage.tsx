import { studio } from '../data/content'
import { Page } from './Page'

interface StudioPageProps {
  onClose: () => void
}

export function StudioPage({ onClose }: StudioPageProps) {
  return (
    <Page label={studio.eyebrow} onClose={onClose}>
      <p className="pg-eyebrow pg-fade">{studio.eyebrow}</p>
      <h2 className="pg-title serif pg-fade">{studio.title}</h2>
      <div className="pg-cols">
        <div>
          <p className="pg-lead pg-fade">{studio.intro}</p>
          {studio.paragraphs.map((p) => (
            <p key={p} className="pg-text pg-fade">{p}</p>
          ))}
        </div>
        <ul className="pg-services">
          {studio.services.map((s, i) => (
            <li key={s.title} className="pg-fade">
              <span className="pg-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="serif">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pg-footer">
        <div className="pg-stats">
          {studio.stats.map((s) => (
            <div key={s.label} className="pg-fade">
              <span className="serif">{s.value}</span>
              <small>{s.label}</small>
            </div>
          ))}
        </div>
        <div className="pg-people">
          {studio.people.map((p) => (
            <div key={p.name} className="pg-fade">
              <span className="serif">{p.name}</span>
              <small>{p.role}</small>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}
