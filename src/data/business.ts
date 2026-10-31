// Single source of truth for company facts (NAP, rating, hours).
// Must match the Google Business Profile: mismatches hurt local rankings.
export const business = {
  name: 'Gartenbau Z.M.',
  owner: 'Zarko Marinovic',
  vatId: 'DE344409912',
  url: 'https://gartenbauzm.de',
  phone: '+491782747470',
  phoneDisplay: '+49 178 2747470',
  email: 'info@gartenbauzm.de',
  whatsapp: 'https://wa.me/491782747470',
  street: 'Lerchenrain 9',
  postalCode: '71686',
  city: 'Remseck am Neckar',
  region: 'Baden-Württemberg',
  geo: { latitude: 48.8951, longitude: 9.2742 },
  // Update together when the Google profile changes: shown as a dated snapshot.
  rating: { value: '4,9', count: 19, asOf: 'Oktober 2026' },
  googleMaps: 'https://www.google.com/maps/place/Gartenbau+Z.M./data=!4m2!3m1!1s0x2625cb54a6bf6c4d:0x872a71cf99053f99',
  googleReview: 'https://g.page/r/CZk_BZnPcSqHEB0/review',
  directory: 'https://www.11880.com/branchenbuch/remseck-am-neckar/170211840B113473726/gartenbau-z-m.html',
};

export const services = [
  { name: 'Gartengestaltung', slug: 'gartengestaltung', description: 'Planung und Neuanlage von Gärten, vom Konzept bis zur Bepflanzung' },
  { name: 'Natursteinarbeiten', slug: 'natursteinarbeiten', description: 'Mauern, Treppen und Einfassungen aus Naturstein' },
  { name: 'Terrassenbau', slug: 'terrassenbau', description: 'Terrassen mit frostsicherem Unterbau und fachgerechter Entwässerung' },
  { name: 'Pflasterarbeiten', slug: 'pflasterarbeiten', description: 'Einfahrten, Wege und Höfe mit sauberer Entwässerung' },
  { name: 'Landschaftsbau', slug: 'landschaftsbau', description: 'Erdarbeiten, Hangbefestigung und Geländemodellierung' },
  { name: 'Rollrasen', slug: 'rollrasen', description: 'Bodenvorbereitung und Verlegung von Rollrasen' },
  { name: 'Sichtschutz', slug: 'sichtschutz', description: 'Sichtschutzzäune, Gabionen und Hecken' },
  { name: 'Hausmeisterservice', slug: 'hausmeisterservice', description: 'Regelmäßige Pflege von Garten und Grundstück' },
];

export const serviceArea = [
  'Remseck am Neckar', 'Ludwigsburg', 'Stuttgart', 'Waiblingen', 'Fellbach', 'Kornwestheim',
  'Esslingen am Neckar', 'Bietigheim-Bissingen', 'Korntal-Münchingen', 'Leonberg', 'Böblingen', 'Sindelfingen',
];
