import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// AI and search crawlers are welcome: the site is public information meant to be cited.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url }
}
