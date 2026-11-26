export type Project = {
  title: string
  place: string
  story: string
  /** Path or URL of the cover image (e.g. '/projects/foo.jpg' from /public). Placeholder art is drawn when missing. */
  image?: string
  /** width / height of the card. Ignored once a real image loads (its own ratio is used). */
  aspect?: number
}

// The sphere always shows 88 cards and cycles through this list.
// TODO: add the university projects once chosen.
export const projects: Project[] = [
  {
    title: 'Abakode',
    place: 'Sito web · React, Three.js, GSAP · 2026',
    story:
      "Il sito che stai guardando. Si entra scorrendo dentro un'iride, si attraversa il buio e i progetti appaiono su una sfera sospesa tra le stelle: si gira, ci si entra dentro e ogni lavoro vola in primo piano quando lo scegli.",
    image: '/projects/abakode.jpg',
  },
  {
    title: 'AI Particle Simulator',
    place: 'Web app · WebGL · GitHub Pages',
    story:
      "Ventimila particelle che si ricompongono in tempo reale: galassie, attrattori caotici, nastri di Möbius, un cuore anatomico, un motore V8. Si regolano velocità e luce, si scrive codice per creare forme nuove e si può persino controllare tutto con le mani davanti alla webcam.",
    image: '/projects/particles.jpg',
  },
  {
    title: 'The Course of Empire',
    place: 'Sito web · Three.js, GSAP · 2026',
    story:
      "I tre quadri di Thomas Cole raccontati come un unico film da scorrere. Si entra in una sala di museo in 3D, la camera attraversa la cornice e il dipinto prende vita: dall'impero al suo crollo, fino alle rovine sotto la luna.",
    image: '/projects/impero.jpg',
  },
  {
    title: 'Gyre',
    place: 'Sito web · Concept · 2026',
    story:
      "Concept per uno studio di design e sviluppo: nove siti che girano lungo le pareti di un pozzo. Si scende scorrendo, ogni anello è un progetto e il centro è l'ingresso.",
    image: '/projects/gyre.jpg',
  },
  {
    title: 'PackYourBudget',
    place: 'Sito web · Astro · 2026',
    story:
      "Un sito di viaggi che parte dal budget: scrivi quanto vuoi spendere e il pianificatore mostra le mete che ci stanno dentro, con volo, alloggio e spese già divisi. 38 mete, 18 città di partenza, 5 lingue e una grafica a tema aeroporto.",
    image: '/projects/pyb.jpg',
  },
  {
    title: 'La Torretta a Chiaia',
    place: 'Sito web · Astro, Three.js · Napoli',
    story:
      "Il sito di un B&B in un palazzo d'epoca sulla Riviera di Chiaia. Quattro camere, quattro lingue, una torre in 3D che sale da terra e il golfo di Napoli ricostruito dietro l'America's Cup.",
    image: '/projects/torretta.jpg',
  },
  {
    title: 'Mac Deep Clean',
    place: 'App macOS · SwiftUI · Mac App Store',
    story:
      "Disco, RAM, CPU, rete e batteria in tempo reale, e una pulizia che libera spazio senza toccare i documenti. La pulizia rapida è gratuita; profili avanzati, disinstallazione e widget sono nella versione Pro.",
    image: '/projects/macdeepclean.jpg',
  },
  {
    title: 'FreshCheck',
    place: 'App iOS e Android · Expo · App Store',
    story:
      "Tiene traccia delle scadenze in frigo e in dispensa e avvisa prima che il cibo vada buttato. Si aggiunge un prodotto in pochi secondi col codice a barre, l'app propone ricette con ciò che sta per scadere e mostra quanto hai risparmiato.",
    image: '/projects/freshcheck.jpg',
  },
  {
    title: 'SubTracker',
    place: 'App iOS · SwiftUI · App Store',
    story:
      "Tutti gli abbonamenti in un posto: quanto spendi al mese e all'anno, i prossimi rinnovi in calendario e un promemoria prima di ogni addebito, così nessuna prova gratuita si trasforma in un pagamento dimenticato.",
    image: '/projects/subtracker.jpg',
  },
  {
    title: 'UniStats',
    place: 'App iOS · SwiftUI, Swift Charts',
    story:
      "La carriera universitaria in numeri: media ponderata, base di laurea e andamento nel tempo. Il simulatore dice che voto serve per raggiungere un obiettivo e permette di provare esami ipotetici prima di sostenerli.",
    image: '/projects/unistats.jpg',
  },
  {
    title: 'FaceMac',
    place: 'App macOS · Swift, Core ML',
    story:
      "Sblocca il Mac guardando la webcam, con un'esperienza simile a Face ID: animazione nel notch, riconoscimento del volto e controllo anti-spoofing, tutto in locale. Nessuna immagine o dato biometrico lascia il computer. Nasce dal progetto open source glance.",
    image: '/projects/facemac.jpg',
  },
  {
    title: 'Digital Art Museum',
    place: 'App · Flutter · iOS, Android, Web',
    story:
      "Un museo d'arte da tenere in tasca, con un'interfaccia scura ed elegante: quadri nelle loro cornici, sculture scontornate da esplorare, mostre curate e una sezione di storia dell'arte. Si cercano le opere, si salvano le preferite e l'app parla più lingue.",
    image: '/projects/museum.jpg',
  },
  {
    title: 'Gradini',
    place: 'Gioco iOS · SwiftUI · In sviluppo',
    story:
      "Un gioco di parole italiano: da una parola all'altra cambiando una lettera alla volta, con parole sempre di senso compiuto. 90 livelli in tre categorie da 4, 5 e 6 lettere, generati da un dizionario costruito a mano.",
    image: '/projects/gradini.jpg',
  },
]
