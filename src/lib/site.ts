export const SITE = {
  name: 'Odyssey Travel',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.example.com').replace(/\/$/, ''),
  tagline: 'Sikh holy places, historical sites and community places in Pakistan',
  description:
    'Explore gurdwaras, historical sites and Sikh community places across Pakistan with their history, location and details, then message us on WhatsApp or email to plan your visit.',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '',
  email: process.env.NEXT_PUBLIC_EMAIL || '',
}

export const waLink = (text = 'Hello Odyssey Travel, I would like to plan a visit.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
export const mailLink = (subject = 'Visit enquiry') =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`

export type ThemeKey = 'A' | 'B' | 'C' | 'D' | 'E'
export type Theme = { name: string; hv: 'v1' | 'v2' | 'v3'; title: string; h1: string; loader: string; bg: string; ac: string; onac: string; big: 'ac' | 'ac2' }
// h1 / loader are image keys "<place-slug>/<file>"
export const THEMES: Record<ThemeKey, Theme> = {
  A: { name: 'Saffron', hv: 'v1', title: 'Visit the holy places of Sikhi', h1: 'gurdwara-janam-asthan/01', loader: 'gurdwara-janam-asthan/01', bg: '#FFFFFF', ac: '#F58A07', onac: '#0B2A5B', big: 'ac2' },
  B: { name: 'Marble', hv: 'v3', title: 'Sacred places of the Sikhs', h1: 'gurdwara-janam-asthan/04', loader: 'gurdwara-janam-asthan/04', bg: '#FBFAF7', ac: '#C99A2E', onac: '#1B1B1B', big: 'ac2' },
  C: { name: 'Fields', hv: 'v1', title: 'Find Sikh holy places across Pakistan', h1: 'gurdwara-janam-asthan/05', loader: 'gurdwara-janam-asthan/05', bg: '#F6F9EF', ac: '#2F7D4F', onac: '#FFFFFF', big: 'ac2' },
  D: { name: 'Sky', hv: 'v2', title: 'Discover the holy places of Sikhi', h1: 'gurdwara-janam-asthan/02', loader: 'gurdwara-janam-asthan/02', bg: '#FFFFFF', ac: '#1D5FD6', onac: '#FFFFFF', big: 'ac2' },
  E: { name: 'Orange', hv: 'v1', title: 'Walk where the Gurus walked', h1: 'gurdwara-janam-asthan/06', loader: 'gurdwara-janam-asthan/06', bg: '#FFF8F2', ac: '#FF6A13', onac: '#2B1205', big: 'ac' },
}
export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[]
export const imgPath = (k: string) => `/places/${k}.jpg`
