import raw from '@/data/places.json'

export type PImage = { src: string; w: number; h: number; alt: string; author: string; license: string; page: string }
export type Place = {
  slug: string; name: string; city: string; province: string; area: string; type: string; rich: boolean
  summary: string; history: { heading: string; text: string }[]; coords: { lat: number; lng: number } | null
  images: PImage[]; wiki?: string
}
export const PLACES = raw as Place[]
export const getPlace = (slug: string) => PLACES.find((p) => p.slug === slug)
export const initial = (n: string) => (n.split(' ')[1] ?? n)[0]

// Preferred cover photo per place (file name), otherwise the first image
const COVER: Record<string, string> = { 'gurdwara-janam-asthan': '01.jpg', 'gurdwara-darbar-sahib-kartarpur': '06.jpg', 'gurdwara-dera-sahib': '05.jpg', 'gurdwara-babe-di-ber': '03.jpg' }
export const cover = (p: Place) => p.images.find((i) => i.src.endsWith('/' + COVER[p.slug])) ?? p.images[0]
export const FEATURED = ['gurdwara-janam-asthan', 'gurdwara-darbar-sahib-kartarpur', 'gurdwara-dera-sahib', 'gurdwara-babe-di-ber'].map((s) => getPlace(s)!)
export const STATS = { places: PLACES.length, cities: new Set(PLACES.map((p) => p.city)).size, provinces: new Set(PLACES.map((p) => p.province)).size }
export const FILTERS = ['All', 'Gurdwaras', 'Historical sites', 'Community places', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa']
export const matches = (p: Place, f: string, q: string) =>
  (f === 'All' || p.type === f || p.province === f) && (!q || `${p.name} ${p.city} ${p.province}`.toLowerCase().includes(q.toLowerCase()))
export const noIndex = (p: Place) => !p.rich
