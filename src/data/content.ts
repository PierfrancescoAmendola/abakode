// All site copy lives here. Replace placeholders (marked TODO) when the final texts are ready.
export type PageId = 'projects' | 'studio' | 'contact'

export const site = {
  title: 'We See Through the Code',
  owner: 'Abakode',
  slogan: 'Eyes on details.',
  bio: "Siamo uno studio di sviluppo e design nato a Napoli. Creiamo app mobile e desktop, siti web, piattaforme SaaS e automazioni, curando ogni dettaglio dall'idea alla messa online. Entra nella sfera e scegli un progetto.",
  year: 2026,
  menu: [
    { id: 'projects', label: 'Progetti' },
    { id: 'studio', label: 'Studio' },
    { id: 'contact', label: 'Contatti' },
  ] as { id: PageId; label: string }[],
}

export const studio = {
  eyebrow: 'Studio',
  title: 'Guardiamo i dettagli che gli altri non vedono.',
  intro:
    "Abakode è uno studio di sviluppo e design nato a Napoli. Progettiamo e costruiamo app mobile e desktop, siti web, piattaforme SaaS e automazioni, dall'idea alla pubblicazione.",
  paragraphs: [
    'Lavoriamo in due, senza passaggi di mano: chi disegna è anche chi scrive il codice. Così ogni animazione, ogni transizione e ogni pixel arriva online esattamente come era stato pensato.',
    'Ci piacciono i progetti in cui la tecnica serve a raccontare qualcosa: un museo da attraversare, un budget che diventa un viaggio, un sito che si apre come un occhio.',
  ],
  services: [
    { title: 'App mobile', text: 'App per iOS e Android, native in SwiftUI o multipiattaforma con Expo e Flutter, fino alla pubblicazione sugli store.' },
    { title: 'App desktop', text: 'Software per macOS e Windows, veloce e pensato per chi lo usa ogni giorno.' },
    { title: 'Siti web', text: 'Siti su misura, animati e veloci, con 3D e WebGL quando servono.' },
    { title: 'Piattaforme SaaS', text: 'Prodotti web completi: account, pagamenti, dashboard e tutto quello che serve per farli crescere.' },
    { title: 'Automazioni', text: 'Flussi che lavorano al posto tuo: dati, documenti, notifiche e integrazioni tra i servizi che usi già.' },
  ],
  // TODO: second partner's name and role.
  people: [
    { name: 'Pierfrancesco Amendola', role: 'Design e sviluppo' },
    { name: 'Nome Cognome', role: 'Design e sviluppo' },
  ],
  stats: [
    { value: '13', label: 'progetti' },
    { value: '7', label: 'app' },
    { value: '5', label: 'lingue nei nostri siti' },
  ],
}

export const contact = {
  eyebrow: 'Contatti',
  title: 'Hai un progetto in mente?',
  intro: 'Raccontaci cosa vuoi costruire. Rispondiamo entro un giorno lavorativo.',
  // TODO: real address, phone and social links.
  email: 'ciao@abakode.it',
  city: 'Napoli, Italia',
  links: [
    { label: 'GitHub', href: 'https://github.com/PierfrancescoAmendola' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}
