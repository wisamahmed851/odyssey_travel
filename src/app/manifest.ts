import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return { name: SITE.name, short_name: 'Odyssey', description: SITE.tagline, start_url: '/', display: 'standalone', background_color: '#FFFFFF', theme_color: '#F58A07', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }] }
}
