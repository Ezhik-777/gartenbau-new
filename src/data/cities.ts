// Local landing pages. Every entry needs its own substance: near-duplicate
// city pages count as doorway pages for Google. Add only verifiable facts,
// and no projects or customers in a city unless they really exist.
export interface City {
  slug: string;
  name: string;
  distanceKm: number;
  districts: string[];
  intro: string;
  terrain: string;
  focus: { title: string; text: string }[];
  rules: string;
  rulesLink?: { href: string; label: string };
  photos: { src: string; alt: string }[];
  services: string[];
}

export const cities: City[] = [
  {
    slug: 'remseck',
    name: 'Remseck am Neckar',
    distanceKm: 0,
    districts: ['Aldingen', 'Hochberg', 'Hochdorf', 'Neckargröningen', 'Neckarrems', 'Pattonville'],
    intro: 'Remseck ist unser Heimatort: Hier sitzt unser Betrieb, und von hier aus fahren wir zu jeder Baustelle. Für Sie heißt das kurze Anfahrt und ein Ansprechpartner, der schnell vor Ort ist, auch für kleinere Arbeiten.',
    terrain: 'Rems und Neckar treffen in Remseck zusammen, die Stadtteile liegen teils am Hang über dem Tal. Wer hier eine Terrasse oder einen Weg baut, muss deshalb oft Höhenunterschiede abfangen und das Regenwasser gezielt vom Haus wegführen.',
    focus: [
      { title: 'Hang und Höhenversatz', text: 'Stützmauern, Stufen und Palisaden, damit aus einer Böschung nutzbare Gartenfläche wird.' },
      { title: 'Kleine Aufträge', text: 'Auch einzelne Arbeiten wie ein Stellplatz oder ein Stück Einfassung lohnen sich bei uns wegen der kurzen Anfahrt.' },
      { title: 'Pflege in der Nachbarschaft', text: 'Regelmäßige Grundstückspflege lässt sich mit wenig Anfahrt gut einplanen.' },
    ],
    rules: 'Ob für Ihr Grundstück ein Bebauungsplan oder eine örtliche Vorschrift gilt, klären wir vor dem Baustart gemeinsam mit Ihnen und im Zweifel mit der Stadt Remseck.',
    photos: [
      { src: '/img/image_1.webp', alt: 'Terrassierter Hang mit Palisaden und Treppe während der Erdarbeiten' },
      { src: '/img/image_124.webp', alt: 'Garten mit Rasen, Trittplatten und Splittweg nach dem Umbau' },
      { src: '/img/image_48.webp', alt: 'Erdarbeiten mit dem Minibagger im Garten' },
    ],
    services: ['landschaftsbau', 'natursteinarbeiten', 'hausmeisterservice'],
  },
  {
    slug: 'ludwigsburg',
    name: 'Ludwigsburg',
    distanceKm: 6,
    districts: ['Eglosheim', 'Grünbühl', 'Hoheneck', 'Neckarweihingen', 'Oßweil', 'Pflugfelden', 'Poppenweiler', 'Schlösslesfeld'],
    intro: 'Ludwigsburg liegt gleich westlich von Remseck, Neckarweihingen und Poppenweiler sind praktisch Nachbarn. Wir übernehmen hier Gartenumbauten, Pflaster- und Terrassenarbeiten, von der ersten Besichtigung bis zur Übergabe.',
    terrain: 'Die Barockstadt ist dicht bebaut, zu vielen Häusern gehören schmale Seitenwege und kleine Gärten. Ins Hoheneck und nach Neckarweihingen fällt das Gelände dagegen zum Neckar hin ab. Vor dem Angebot prüfen wir deshalb immer, wie Bagger und Material aufs Grundstück kommen.',
    focus: [
      { title: 'Schmale Zugänge', text: 'Reihenhausgärten und enge Durchgänge bauen wir mit kleiner Technik und viel Handarbeit um.' },
      { title: 'Einfahrten und Stellplätze', text: 'Pflasterflächen mit tragfähigem Unterbau und sauber geführtem Regenwasser.' },
      { title: 'Terrassen am Haus', text: 'Neue Beläge oder Erneuerung alter Terrassen, mit Gefälle vom Gebäude weg.' },
    ],
    rules: 'Die Stadt Ludwigsburg hat eine eigene Baumschutzsatzung. Soll für den Umbau ein größerer Baum weichen, klären Sie vorab mit der Stadt, ob eine Genehmigung nötig ist. Wir sprechen das bei der Besichtigung an.',
    photos: [
      { src: '/img/image_20.webp', alt: 'Schmaler Seitengarten mit Trittplatten in Splitt und Rasenstreifen' },
      { src: '/img/image_9.webp', alt: 'Stellplatz neben dem Haus mit dunklem Betonpflaster' },
      { src: '/img/image_143.webp', alt: 'Terrasse aus großformatigen grauen Platten am Haus' },
    ],
    services: ['gartengestaltung', 'pflasterarbeiten', 'terrassenbau'],
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    distanceKm: 15,
    districts: ['Mühlhausen', 'Hofen', 'Münster', 'Stammheim', 'Zuffenhausen', 'Bad Cannstatt', 'Feuerbach', 'Weilimdorf'],
    intro: 'Stuttgart erreichen wir über die Neckarschiene schnell, besonders die nördlichen Bezirke wie Mühlhausen, Hofen und Stammheim. Wir bauen dort Stützmauern, Treppen, Terrassen und Gärten, auch auf schwierigen Grundstücken.',
    terrain: 'Stuttgart ist die Stadt der Hänge und Stäffele. Viele Grundstücke fallen deutlich ab, die Zufahrten sind oft eng und zum Abstellen von Material bleibt wenig Platz. Solche Lagen entscheiden über Technik, Ablauf und Aufwand, darum sehen wir sie uns vor jedem Angebot persönlich an.',
    focus: [
      { title: 'Stützmauern und Treppen', text: 'L-Steine, Naturstein und Palisaden, um Hanggrundstücke sicher zu terrassieren.' },
      { title: 'Entwässerung', text: 'Rinnen, Gefälle und Drainage, damit Hangwasser nicht am Haus ankommt.' },
      { title: 'Enge Baustellen', text: 'Materiallogistik mit kleiner Technik, wenn kein Lkw bis vors Haus kommt.' },
    ],
    rules: 'In Stuttgart gilt eine Baumschutzsatzung, Fällungen sind nur außerhalb der Vegetationszeit möglich. Das plant man bei einem Gartenumbau am besten früh ein.',
    rulesLink: { href: 'https://www.stuttgart.de/leben/natur/parklandschaften/baeume/baumfaellungen', label: 'Baumfällungen bei der Stadt Stuttgart' },
    photos: [
      { src: '/img/projekt-l-steine.webp', alt: 'Stützmauer aus L-Steinen mit Minibagger' },
      { src: '/img/image_114.webp', alt: 'Treppen und Stützmauern aus Naturstein an einer gepflasterten Zufahrt' },
      { src: '/img/image_157.webp', alt: 'Gepflasterte Fläche mit Entwässerungsrinne' },
    ],
    services: ['natursteinarbeiten', 'landschaftsbau', 'terrassenbau'],
  },
  {
    slug: 'waiblingen',
    name: 'Waiblingen',
    distanceKm: 8,
    districts: ['Beinstein', 'Bittenfeld', 'Hegnach', 'Hohenacker', 'Neustadt'],
    intro: 'Waiblingen, die Kreisstadt des Rems-Murr-Kreises, liegt von Remseck aus direkt die Rems hinauf. Hegnach und Hohenacker sind nur wenige Minuten entfernt. Wir verlegen hier Pflaster und Rollrasen und gestalten ganze Gärten neu.',
    terrain: 'Im Remstal wechseln sich flache Lagen am Fluss und ansteigende Wohngebiete ab. Bei einem Neubau ist der Boden im Garten oft stark verdichtet und mit Bauschutt durchsetzt. Das muss vor Rasen oder Bepflanzung erst behoben werden, sonst wächst nichts dauerhaft an.',
    focus: [
      { title: 'Gärten am Neubau', text: 'Boden lockern, planieren und mit Oberboden aufbauen, danach Rollrasen und Hecke.' },
      { title: 'Rollrasen', text: 'Sofort grüne Fläche, wenn der Unterbau vorher richtig vorbereitet wurde.' },
      { title: 'Hof und Zufahrt', text: 'Betonpflaster mit tragfähigem Unterbau für den täglichen Fahrzeugverkehr.' },
    ],
    rules: 'Ob eine örtliche Regelung für Bäume oder Einfriedungen greift, klären wir vor dem Baustart im Einzelfall mit Ihnen und im Zweifel mit der Stadt Waiblingen.',
    photos: [
      { src: '/img/image_164.webp', alt: 'Rollrasen wird auf vorbereitetem Boden verlegt' },
      { src: '/img/image_167.webp', alt: 'Fertiger Rollrasen mit Hecke und Pflasterweg' },
      { src: '/img/image_31.webp', alt: 'Hoffläche mit anthrazitfarbenem Betonpflaster' },
    ],
    services: ['rollrasen', 'gartengestaltung', 'pflasterarbeiten'],
  },
  {
    slug: 'fellbach',
    name: 'Fellbach',
    distanceKm: 10,
    districts: ['Schmiden', 'Oeffingen'],
    intro: 'Fellbach mit Schmiden und Oeffingen grenzt fast an Remseck, Oeffingen erreichen wir in wenigen Minuten. Hier sind besonders Sichtschutz, Terrassen und Natursteinarbeiten gefragt.',
    terrain: 'Am Kappelberg wird Wein angebaut, die Lagen am Hang prägen die Stadt. Die Wohngebiete sind eng bebaut, die Gärten oft klein, und es geht oft um mehr Privatsphäre zum Nachbarn. Wir planen Sichtschutz so, dass er zum Grundstück passt und auch dem Wind standhält.',
    focus: [
      { title: 'Sichtschutz', text: 'Holz, Metall oder Gabionen, mit fest gegründeten Pfosten.' },
      { title: 'Kleine Gärten', text: 'Klare Wege und Beete, die aus wenig Fläche viel machen.' },
      { title: 'Natursteinmauern', text: 'Hochbeete und Einfassungen, die Höhenunterschiede im Garten aufnehmen.' },
    ],
    rules: 'Fellbach hat eine Baumschutzsatzung: Geschützte Bäume dürfen nur nach Antrag bei der Stadt gefällt werden. Das sollten Sie bei einem Umbau früh abklären.',
    photos: [
      { src: '/img/image_113.webp', alt: 'Sichtschutz aus Holzelementen an einem gepflasterten Sitzplatz' },
      { src: '/img/image_18.webp', alt: 'Graue Sichtschutzelemente mit Koniferen an der Grundstücksgrenze' },
      { src: '/img/image_103.webp', alt: 'Geschwungene Natursteinmauer am Pflasterbelag' },
    ],
    services: ['sichtschutz', 'natursteinarbeiten', 'terrassenbau'],
  },
  {
    slug: 'kornwestheim',
    name: 'Kornwestheim',
    distanceKm: 7,
    districts: ['Pattonville (Anteil)'],
    intro: 'Kornwestheim liegt zwischen Remseck und Stuttgart, gemeinsam mit Remseck gehört auch Pattonville dazu. Wir erneuern hier Terrassen, Einfahrten und Gärten, oft bei Häusern, deren Außenanlagen in die Jahre gekommen sind.',
    terrain: 'Die Stadt ist flach und dicht bebaut. Alte Terrassenbeläge und abgesackte Einfahrten sind hier typische Aufgaben. Bevor wir neu verlegen, prüfen wir, ob der vorhandene Unterbau trägt oder erneuert werden muss. Das entscheidet über Haltbarkeit und Preis.',
    focus: [
      { title: 'Terrassen erneuern', text: 'Alten Belag prüfen, Unterbau sanieren und neu verlegen.' },
      { title: 'Abgesackte Einfahrten', text: 'Pflaster aufnehmen, Tragschicht neu aufbauen und wieder sauber verlegen.' },
      { title: 'Rasen und Einfassung', text: 'Neue Rasenflächen mit klaren Kanten zum Weg.' },
    ],
    rules: 'Ob eine örtliche Regelung für Ihr Vorhaben greift, klären wir vor dem Baustart im Einzelfall mit Ihnen und im Zweifel mit der Stadt Kornwestheim.',
    photos: [
      { src: '/img/image_141.webp', alt: 'Alte Terrasse wird mit neuen Platten erneuert' },
      { src: '/img/image_142.webp', alt: 'Erneuerte Terrasse mit grauen Platten und Rasen' },
      { src: '/img/image_29.webp', alt: 'Dunkel gepflasterte Zufahrt mit Tor neben dem Haus' },
    ],
    services: ['terrassenbau', 'pflasterarbeiten', 'rollrasen'],
  },
  {
    slug: 'esslingen',
    name: 'Esslingen am Neckar',
    distanceKm: 17,
    districts: ['Berkheim', 'Mettingen', 'Oberesslingen', 'Sirnau', 'Zell'],
    intro: 'Esslingen liegt neckaraufwärts und gehört zu unserem weiteren Einsatzgebiet. Wir übernehmen hier vor allem größere Arbeiten wie Mauern, Hangbefestigungen und komplette Außenanlagen.',
    terrain: 'Über der Altstadt ziehen sich die Weinberge den Hang hinauf, und auch viele Wohngebiete liegen in Hanglage. Für Grundstücke mit Gefälle braucht es Terrassierung, sichere Treppen und eine durchdachte Entwässerung, bevor es an die Gestaltung geht.',
    focus: [
      { title: 'Hangbefestigung', text: 'Stützmauern und Palisaden, die das Gelände dauerhaft sichern.' },
      { title: 'Treppen im Garten', text: 'Natursteinstufen, die Ebenen sicher verbinden.' },
      { title: 'Komplette Außenanlagen', text: 'Vom Erdbau über Pflaster bis zur Bepflanzung aus einer Hand.' },
    ],
    rules: 'Ob eine örtliche Regelung für Bäume oder Mauern greift, klären wir vor dem Baustart im Einzelfall mit Ihnen und im Zweifel mit der Stadt Esslingen.',
    photos: [
      { src: '/img/image_77.webp', alt: 'Natursteinmauer und Treppe am Hang im Bau' },
      { src: '/img/image_109.webp', alt: 'Natursteinstufen mit bepflanztem Beet und Einfassung' },
      { src: '/img/image_129.webp', alt: 'Fertige Außenanlage mit Rasen, Trittplatten und Splittweg' },
    ],
    services: ['landschaftsbau', 'natursteinarbeiten', 'gartengestaltung'],
  },
  {
    slug: 'bietigheim-bissingen',
    name: 'Bietigheim-Bissingen',
    distanceKm: 13,
    districts: ['Bietigheim', 'Bissingen', 'Metterzimmern'],
    intro: 'Bietigheim-Bissingen liegt im Norden des Landkreises Ludwigsburg und ist von Remseck aus gut erreichbar. Wir bauen hier Gärten, Pflasterflächen und Wege, sowohl für Einzelgewerke als auch für komplette Umgestaltungen.',
    terrain: 'Enz und Metter treffen hier zusammen, viele Gärten liegen am Rand des Tals. In Ortsteilen wie Metterzimmern gibt es neuere Wohngebiete, die Altstadt von Bietigheim ist dagegen eng. Je nach Lage ist also entweder Geländearbeit oder Logistik die größere Aufgabe.',
    focus: [
      { title: 'Gartenwege', text: 'Splittwege und Plattenwege mit fester Einfassung, die sich nicht verschieben.' },
      { title: 'Beete und Bepflanzung', text: 'Grüne Gartenflächen mit Natursteinkanten statt Schotterflächen.' },
      { title: 'Stellplätze', text: 'Gepflasterte Flächen mit passendem Unterbau.' },
    ],
    rules: 'Ob eine örtliche Regelung für Ihr Vorhaben greift, klären wir vor dem Baustart im Einzelfall mit Ihnen und im Zweifel mit der Stadt Bietigheim-Bissingen.',
    photos: [
      { src: '/img/image_123.webp', alt: 'Geschwungener Splittweg mit Natursteineinfassung' },
      { src: '/img/image_131.webp', alt: 'Beet mit Findlingen und Natursteineinfassung am Weg' },
      { src: '/img/image_6.webp', alt: 'Verdichtete Tragschicht für einen Stellplatz neben dem Haus' },
    ],
    services: ['gartengestaltung', 'pflasterarbeiten', 'sichtschutz'],
  },
];
