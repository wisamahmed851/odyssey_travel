import type { MetadataRoute } from 'next'
import { PLACES, noIndex } from '@/lib/places'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/places`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...PLACES.filter((p) => !noIndex(p)).map((p) => ({ url: `${SITE.url}/places/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
